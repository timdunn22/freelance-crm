# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_01_13_204136) do
  create_table "interactions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "interaction_date"
    t.string "interaction_type"
    t.integer "lead_id", null: false
    t.text "notes"
    t.datetime "updated_at", null: false
    t.index ["lead_id"], name: "index_interactions_on_lead_id"
  end

  create_table "lead_tags", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "lead_id", null: false
    t.integer "tag_id", null: false
    t.datetime "updated_at", null: false
    t.index ["lead_id"], name: "index_lead_tags_on_lead_id"
    t.index ["tag_id"], name: "index_lead_tags_on_tag_id"
  end

  create_table "leads", force: :cascade do |t|
    t.string "company"
    t.datetime "created_at", null: false
    t.string "email"
    t.decimal "estimated_value"
    t.string "name"
    t.text "notes"
    t.string "phone"
    t.string "status"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.string "website"
    t.index ["status"], name: "index_leads_on_status"
    t.index ["user_id"], name: "index_leads_on_user_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "color"
    t.datetime "created_at", null: false
    t.string "name"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["user_id"], name: "index_tags_on_user_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.boolean "completed"
    t.datetime "created_at", null: false
    t.text "description"
    t.datetime "due_date"
    t.integer "lead_id", null: false
    t.string "priority"
    t.string "title"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["lead_id"], name: "index_tasks_on_lead_id"
    t.index ["user_id"], name: "index_tasks_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email"
    t.string "name"
    t.string "password_digest"
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "interactions", "leads"
  add_foreign_key "lead_tags", "leads"
  add_foreign_key "lead_tags", "tags"
  add_foreign_key "leads", "users"
  add_foreign_key "tags", "users"
  add_foreign_key "tasks", "leads"
  add_foreign_key "tasks", "users"
end
