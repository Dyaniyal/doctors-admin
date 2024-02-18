FactoryBot.define do
  factory :member do
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    gender { Member.genders.keys.sample }
    role { Member.roles.keys.sample }
    age { Faker::Number.between(from: 20, to: 60) }
    avatar { Faker::Avatar.image }  

    factory :doctor do
      role { :doctor }
    end

    factory :patient do
      role { :patient }
    end
  end
end
