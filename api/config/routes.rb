Rails.application.routes.draw do
  resources :opportunities
  resources :members
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  get 'ping', to: 'ping#index'
end
