class AddStageToOpportunities < ActiveRecord::Migration[7.0]
  def change
    add_column :opportunities, :stage, :string
  end
end
