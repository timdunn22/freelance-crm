class Tag < ApplicationRecord
  belongs_to :user
  has_many :lead_tags, dependent: :destroy
  has_many :leads, through: :lead_tags

  validates :name, presence: true
  validates :name, uniqueness: { scope: :user_id }
end
