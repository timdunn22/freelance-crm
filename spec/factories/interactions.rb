FactoryBot.define do
  factory :interaction do
    lead
    interaction_type { "email" }
    notes { "Had a good conversation" }
    interaction_date { Time.current }
  end
end
