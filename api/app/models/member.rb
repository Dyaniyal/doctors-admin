class Member < ApplicationRecord

	enum gender: [:male, :female]
	enum role: [:doctor, :patient]

	has_many :opportunities
end
