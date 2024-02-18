class OpportunitiesController < ApplicationController
  before_action :set_opportunity, only: %i[ show update destroy ]

  # GET /opportunities
  def index
    opportunities = if params[:query].present?
      Opportunity.fuzzy_search(params[:query])
    else
      Opportunity.includes(:patient, :doctor)      
    end

    leads = opportunities.lead.order(created_at: :desc).as_json(include: [:doctor, :patient])
    qualified = opportunities.qualified.as_json(include: [:doctor, :patient])
    booked = opportunities.booked.as_json(include: [:doctor, :patient])
    treated = opportunities.treated.as_json(include: [:doctor, :patient])

    render json: {
      leads: leads,
      qualified: qualified,
      booked: booked,
      treated: treated
    }
  end

  # GET /opportunities/1
  def show
    render json: @opportunity
  end

  # POST /opportunities
  def create
    @opportunity = Opportunity.new(opportunity_params)

    if @opportunity.save
      render json: @opportunity, status: :created, location: @opportunity
    else
      render json: @opportunity.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /opportunities/1
  def update
    if @opportunity.update(opportunity_params)
      render json: @opportunity
    else
      render json: @opportunity.errors, status: :unprocessable_entity
    end
  end

  # DELETE /opportunities/1
  def destroy
    @opportunity.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_opportunity
      @opportunity = Opportunity.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def opportunity_params
      params.require(:opportunity).permit(
        :procedure_name, 
        :patient_id, 
        :doctor_id, 
        :stage,
        stage_history: {}
      )
    end
end
