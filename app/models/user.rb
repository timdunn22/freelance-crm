class User < ApplicationRecord
  has_secure_password
  has_many :leads, dependent: :destroy
  has_many :tasks, dependent: :destroy
  has_many :tags, dependent: :destroy

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 6 }, if: :password_required?

  private

  def password_required?
    new_record? || password.present?
  end
end
