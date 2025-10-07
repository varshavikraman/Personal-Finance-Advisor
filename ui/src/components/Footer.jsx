import React from 'react'
import logo from '../assets/IMAGE/Savesage-logo29.png'

const Footer = () => {
  return (
    <footer className="bg-yellow-400 text-gray-300 px-6 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            <div>
                <img src={logo} alt="logo" className="h-24 sm:h-28 mb-4"/>
                <p className="text-yellow-800">Your Personal Finance Advisor</p>
            </div>

            <div>
                <h2 className="text-yellow-950 font-semibold text-lg mb-4">GET TO KNOW US</h2>
                <ul className="space-y-2 text-sm">
                    <li><a href="" className="text-yellow-800">About SaveSage</a></li>
                    <li><a href="" className="text-yellow-800">Careers</a></li>
                    <li><a href="" className="text-yellow-800">Contact Us</a></li>
                </ul>
            </div>

            <div>
                <h2 className="text-yellow-950 font-semibold text-lg mb-4">LEGAL</h2>
                <ul className="space-y-2 text-sm">
                    <li><a href="" className="text-yellow-800">Terms of Service</a></li>
                    <li><a href="" className="text-yellow-800">Privacy Policy</a></li>
                </ul>
            </div>

            <div>
                <h2 className="text-yellow-950 font-semibold text-lg mb-4">Hi there, SaveSage-er!</h2>
                <p className="text-sm text-yellow-800 mb-4">We'd love for you to join us! Follow along for updates and support.</p>
                <div className="flex space-x-4">
                    <a href="" className="text-gray-800 hover:text-yellow-950 transition">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clipRule="evenodd"/>
                        </svg>
                    </a>
                    <a href="" className="text-gray-800 hover:text-yellow-950 transition">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clipRule="evenodd"/>
                        </svg>
                    </a>
                    <a href="" className="text-gray-800 hover:text-yellow-950 transition">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M21.7 8.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.839c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.839 4.225 4.225 0 0 0-.79 1.965 30.146 30.146 0 0 0-.2 3.206v1.5a30.12 30.12 0 0 0 .2 3.206c.094.712.364 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.151 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965 30.12 30.12 0 0 0 .2-3.206v-1.516a30.672 30.672 0 0 0-.202-3.206Zm-11.692 6.554v-5.62l5.4 2.819-5.4 2.801Z" clipRule="evenodd"/>
                        </svg>
                    </a>
                    <a href="" className="text-gray-800 hover:text-yellow-950 transition">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z"/>
                        </svg>
                    </a>
                    <a href="" className="text-gray-800 hover:text-yellow-950 transition">
                        <svg className="w-6 h-6" viewBox="0 0 30 30" fill="currentColor">
                            <path d="M15,3C8.373,3,3,8.373,3,15c0,5.084,3.163,9.426,7.627,11.174c-0.105-0.949-0.2-2.406,0.042-3.442c0.218-0.936,1.407-5.965,1.407-5.965s-0.359-0.719-0.359-1.781c0-1.669,0.967-2.914,2.171-2.914c1.024,0,1.518,0.769,1.518,1.69c0,1.03-0.655,2.569-0.994,3.995c-0.283,1.195,0.599,2.169,1.777,2.169c2.133,0,3.772-2.249,3.772-5.495c0-2.873-2.064-4.882-5.012-4.882c-3.414,0-5.418,2.561-5.418,5.208c0,1.031,0.397,2.137,0.893,2.739c0.098,0.119,0.112,0.223,0.083,0.344c-0.091,0.379-0.293,1.194-0.333,1.361c-0.052,0.22-0.174,0.266-0.401,0.16c-1.499-0.698-2.436-2.889-2.436-4.649c0-3.785,2.75-7.262,7.929-7.262c4.163,0,7.398,2.966,7.398,6.931c0,4.136-2.608,7.464-6.227,7.464c-1.216,0-2.359-0.632-2.75-1.378c0,0-0.602,2.291-0.748,2.853c-0.271,1.042-1.002,2.349-1.492,3.146C12.57,26.812,13.763,27,15,27c6.627,0,12-5.373,12-12S21.627,3,15,3z"></path>
                        </svg>
                    </a>
                </div>
            </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 ">
            <p className="text-center text-md text-yellow-950">&copy; 2025 SaveSage. All rights reserved.</p>
        </div>
    </footer>
  )
}

export default Footer