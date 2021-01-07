# Eluvio Live

React Application for Eluvio Live: a platform for ticketed live events focused on concerts, premieres, and live performances.

## Quick start

1.  **Clone repository.**

    After cloning the repository, navigate into the project's directory to install the necessary npm packages.

    ```sh
    git clone https://github.com/eluv-io/elv-live-web.git
    
    cd elv-live-web
    npm install  
    ```

2.  **Start developing.**

    ```sh
    npm run serve
    ```

    Web Application is now running locally at `http://localhost:8086`.

    *Note: The main event page is `http://localhost:8086/d457a576/rita-ora` as the baseurl is set to d457a576 before the launch. 




## File Structure

A quick look at the top-level files and directories.

    .
    ├── node_modules                      # Contains all npm packages
    ├── src                               # Project Source Code
    │   ├── assets                            # Static Assets 
    │   │   ├── data                              # Placeholder text in JSON format                 
    │   │   ├── icons                             # Icons                 
    │   │   ├── images                            # Images                
    │   │   └── styles                            # All SCSS stylesheets                  
    │   ├── components                        # Common React Components shared across project 
    │   │   ├── layout                            # Layout Components - Navigation Bar, Footer, etc                           
    │   │   └── utils                             # Utility Components - AsyncComponent, Switch Button, etc            
    │   ├── pages                             # Organized page-specific components 
    │   │   ├── code                              # Code Redemption Page                
    │   │   ├── confirmation                      # Purchase Confirmation Page                 
    │   │   ├── event                             # Event Page        
    │   │   ├── stream                            # Livestream App Page                 
    │   │   └── support                           # Support/FAQ Page                          
    │   ├── stores                            # MobX state management files           
    │   ├── .index.html                       # Main HTML file - calls semantic UI, bitmovin CDNs  
    │   └── .App                              # Root React file - contains routing logic and renders page components                
    ├── docs                              # Documentation Files 
    ├── mailgun                           # Mailgun templates
    ├── LICENSE                           # MIT License
    ├── package-lock.json                 # Automatically generated file based on NPM dependencies
    ├── package.json                      # A manifest file for metadata, scripts, and dependencies
    ├── README.md                         # Github README
    ├── .eslintrc.json                    # ESlint Configuration file 
    ├── .webpack.config.js                # Webpack Configuration file
    ├── .gitignore                        # Tells git which files it should not track 
    └── .scss-lint.yml                    # SCSS-lint Configuration file