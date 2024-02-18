class MembersController < ApplicationController
  before_action :set_member, only: %i[ show update destroy ]

  # GET /members
  def index
    doctors = Member.doctor.as_json
    patients = Member.patient.as_json

    render json: { doctors: doctors, patients: patients }
  end

  # GET /members/1
  def show
    render json: @member
  end

  # POST /members
  def create
    @member = Member.new(member_params)

    if params[:member][:avatar].present?
      avatar_path = save_avatar(params[:member][:avatar])
      @member.avatar = avatar_path
    end

    date_of_birth = Date.parse(params[:member][:age])
    current_age = Date.current.year - date_of_birth.year - (Date.current.month > date_of_birth.month || 
                  (Date.current.month == date_of_birth.month && Date.current.day >= date_of_birth.day) ? 0 : 1)
    @member.age = current_age

    if @member.save
      render json: @member, status: :created, location: @member
    else
      render json: @member.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /members/1
  def update
    if @member.update(member_params)
      render json: @member
    else
      render json: @member.errors, status: :unprocessable_entity
    end
  end

  # DELETE /members/1
  def destroy
    @member.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_member
      @member = Member.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def member_params
      params.require(:member).permit(:first_name, :last_name, :gender, :age, :role, :avatar)
    end


    def save_avatar(avatar)
      upload_directory = Rails.root.join('public', 'avatars')
      FileUtils.mkdir_p(upload_directory) unless File.directory?(upload_directory)

      filename = SecureRandom.hex(8) + File.extname(avatar.original_filename)
      File.open(upload_directory.join(filename), 'wb') do |file|
        file.write(avatar.read)
      end

      File.join('/avatars', filename)
    end
end
