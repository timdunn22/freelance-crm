FactoryBot.define do
  factory :task do
    user
    lead { nil }
    sequence(:title) { |n| "Task #{n}" }
    description { "Task description" }
    due_date { 1.day.from_now }
    completed { false }
    priority { "medium" }
  end
end
