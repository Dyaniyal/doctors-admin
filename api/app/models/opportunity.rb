class Opportunity < ApplicationRecord
  include AASM

  enum stage: { lead: 'lead', qualified: 'qualified', booked: 'booked', treated: 'treated' }

  aasm column: 'stage', enum: true do
    state :lead, initial: true
    state :qualified
    state :booked
    state :treated

    event :qualify do
      transitions from: :lead, to: :qualified
    end

    event :book do
      transitions from: :qualified, to: :booked
    end

    event :treat do
      transitions from: :booked, to: :treated
    end
  end

  belongs_to :patient, class_name: 'Member'
  belongs_to :doctor, class_name: 'Member'

  def self.fuzzy_search(query)
    joins(:patient, :doctor)
      .where(
        "members.first_name ILIKE :query OR 
        members.last_name ILIKE :query OR 
        opportunities.procedure_name ILIKE :query", query: "%#{query}%")
  end
end
