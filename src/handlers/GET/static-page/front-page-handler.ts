import type { Handler } from "hono"
import { html } from "hono/html"

export const frontPageHandler: Handler = async (c) => {

    return c.html(html`
            <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <link rel="icon" type="image/png" href="https://cdn-icons-png.flaticon.com/512/860/860276.png" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
            <title>API Documentation</title>
          </head>
          <body class="bg-gray-50 h-full">
            <div class="flex flex-col gap-auto h-full"> 
              <header class="bg-white shadow-sm">
                <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  <div class="flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-900">balinkbayan API</h1>
                    <div class="flex space-x-4">
                      <a href="#" class="text-gray-600 hover:text-gray-900">Support</a>
                    </div>
                  </div>
                </nav>
              </header>
        
        
              <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                <div class="text-center mb-16">
                  <h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                    welcome to balinkbayan API documentation
                  </h2>
                
                </div>
        
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                  <!-- Feature 1 -->
                  <div class="bg-white p-6 rounded-lg shadow-sm">
                    <div class="text-2xl mb-4">🚀</div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">
                      Fast & Reliable
                    </h3>
                    <p class="text-gray-600">
                      High-performance API with 99.9% uptime guarantee
                    </p>
                  </div>
        
                  
                  <div class="bg-white p-6 rounded-lg shadow-sm">
                    <div class="text-2xl mb-4">🔒</div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Secure</h3>
                    <p class="text-gray-600">
                      Enterprise-grade security with SSL encryption
                    </p>
                  </div>
        
                  
                  <div class="bg-white p-6 rounded-lg shadow-sm">
                    <div class="text-2xl mb-4">📚</div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">
                      Well Documented
                    </h3>
                    <p class="text-gray-600">
                      Comprehensive documentation and examples
                    </p>
                  </div>
                </div>
        
                
                <div class="bg-white rounded-lg shadow-sm p-8">
                  <h3 class="text-2xl font-bold text-gray-900 mb-4">Getting Started</h3>
                  <div class="bg-gray-800 rounded-lg p-4">
                    <code class="text-green-400">
                      curl -X GET ${c.req.url}openapi.json
                    </code>
                  </div>
                  <div class="mt-4">
                    <a
                      href="/reference"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Read the Docs
                    </a>
                  </div>
                </div>
              </main>
        
             
              <footer class="bg-white mt-16">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <div class="text-center text-gray-500">
                    <p>&copy; 2025 CFO/balinkbayan API. All rights reserved.</p>
                  </div>
                </div>
              </footer>
            </div>
          </body>
        </html>`)
}
