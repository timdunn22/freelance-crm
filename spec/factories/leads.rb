FactoryBot.define do
  factory :lead do
    user
    sequence(:name) { |n| "Lead #{n}" }
    sequence(:email) { |n| "lead#{n}@example.com" }
    company { "Acme Corp" }
    status { "new" }
    notes { "Some notes" }
    phone { "555-1234" }
    website { "https://example.com" }
    estimated_value { 5000 }
  end
end
