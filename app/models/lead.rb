class Lead < ApplicationRecord
  belongs_to :user
  has_many :interactions, dependent: :destroy
  has_many :tasks, dependent: :destroy
  has_many :lead_tags, dependent: :destroy
  has_many :tags, through: :lead_tags

  validates :name, presence: true
  validates :status, inclusion: { in: %w[new contacted qualified proposal negotiation won lost], allow_blank: true }

  STATUSES = %w[new contacted qualified proposal negotiation won lost].freeze

  scope :by_status, ->(status) { where(status: status) }

  def total_interactions
    interactions.count
  end

  def last_interaction_date
    interactions.order(interaction_date: :desc).first&.interaction_date
  end
end
