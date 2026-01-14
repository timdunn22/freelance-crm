require 'rails_helper'

RSpec.describe "Leads", type: :request do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }

  describe "GET /leads" do
    it "returns all leads for the user" do
      create_list(:lead, 3, user: user)
      get "/leads", headers: headers
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).size).to eq(3)
    end

    it "returns unauthorized without token" do
      get "/leads"
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "POST /leads" do
    it "creates a new lead" do
      post "/leads", params: { name: "Test Lead", email: "test@example.com", status: "new" }, headers: headers
      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)["name"]).to eq("Test Lead")
    end
  end

  describe "GET /leads/:id" do
    it "returns the lead details" do
      lead = create(:lead, user: user)
      get "/leads/#{lead.id}", headers: headers
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["name"]).to eq(lead.name)
    end
  end

  describe "PATCH /leads/:id" do
    it "updates the lead" do
      lead = create(:lead, user: user)
      patch "/leads/#{lead.id}", params: { name: "Updated Lead" }, headers: headers
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["name"]).to eq("Updated Lead")
    end
  end

  describe "DELETE /leads/:id" do
    it "deletes the lead" do
      lead = create(:lead, user: user)
      expect { delete "/leads/#{lead.id}", headers: headers }.to change(Lead, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end
  end

  describe "GET /leads/kanban" do
    it "returns leads grouped by status" do
      create(:lead, user: user, status: "new")
      create(:lead, user: user, status: "contacted")
      get "/leads/kanban", headers: headers
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)
      expect(data["new"].size).to eq(1)
      expect(data["contacted"].size).to eq(1)
    end
  end

  describe "PATCH /leads/:id/status" do
    it "updates the lead status" do
      lead = create(:lead, user: user, status: "new")
      patch "/leads/#{lead.id}/status", params: { status: "contacted" }, headers: headers
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["status"]).to eq("contacted")
    end
  end
end
