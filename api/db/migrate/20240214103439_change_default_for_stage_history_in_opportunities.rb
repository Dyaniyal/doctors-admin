class ChangeDefaultForStageHistoryInOpportunities < ActiveRecord::Migration[7.0]
  def change
    change_column_default :opportunities, :stage_history, from: nil, to: {}
  end
end
