FactoryBot.define do
  factory :tag do
    user
    sequence(:name) { |n| "Tag #{n}" }
    color { "#3B82F6" }
  end
end
