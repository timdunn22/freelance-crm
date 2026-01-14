Rails.application.routes.draw do
  # Auth routes
  post '/auth/register', to: 'auth#register'
  post '/auth/login', to: 'auth#login'
  get '/auth/me', to: 'auth#me'

  # Dashboard
  get '/dashboard/stats', to: 'dashboard#stats'

  # Leads with Kanban
  get '/leads/kanban', to: 'leads#kanban'
  patch '/leads/:id/status', to: 'leads#update_status'
  resources :leads do
    resources :interactions
  end

  # Tasks
  get '/tasks/upcoming', to: 'tasks#upcoming'
  get '/tasks/overdue', to: 'tasks#overdue'
  patch '/tasks/:id/toggle', to: 'tasks#toggle_complete'
  resources :tasks

  # Tags
  resources :tags

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
end
