class Task < ApplicationRecord
  belongs_to :user
  belongs_to :lead, optional: true

  validates :title, presence: true
  validates :priority, inclusion: { in: %w[low medium high], allow_blank: true }

  PRIORITIES = %w[low medium high].freeze

  scope :pending, -> { where(completed: false) }
  scope :completed, -> { where(completed: true) }
  scope :overdue, -> { pending.where('due_date < ?', Time.current) }
  scope :upcoming, -> { pending.where('due_date >= ?', Time.current).order(:due_date) }

  def overdue?
    !completed? && due_date.present? && due_date < Time.current
  end
end
