FactoryBot.define do
  factory :opportunity do
    procedure_name { Faker::Lorem.sentence }
    patient
    doctor
    stage_history do
      {
        lead: Faker::Time.forward(days: 1),
        qualified: Faker::Time.forward(days: 2),
        booked: Faker::Time.forward(days: 3),
        treated: Faker::Time.forward(days: 4)
      }
    end
    # Add other attributes as needed
  end
end
