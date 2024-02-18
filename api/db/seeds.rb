# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)


# Assuming you have a file named `seed.rb`

require 'factory_bot_rails'

# Load FactoryBot factories
Dir[Rails.root.join('spec/factories/**/*.rb')].each { |f| require f }

# Create 100 Members
members = FactoryBot.create_list(:member, 100)

# Create 100 Opportunities with random patients and doctors
opportunities = FactoryBot.create_list(:opportunity, 100, patient: members.sample, doctor: members.sample)
