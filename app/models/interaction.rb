class Interaction < ApplicationRecord
  belongs_to :lead

  validates :interaction_type, presence: true, inclusion: { in: %w[email call meeting note other] }
  validates :interaction_date, presence: true

  TYPES = %w[email call meeting note other].freeze

  scope :recent, -> { order(interaction_date: :desc) }
end
