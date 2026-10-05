
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaHome,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white mt-10">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Main Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo / About */}
          <div>
            <h2 className="text-2xl font-bold">
              Sahand <span className="text-green-500">Estate</span>
            </h2>

            <p className="text-slate-300 text-sm leading-6 mt-4">
              Find your perfect place with Sahand Estate. We help you buy, sell,
              and rent properties with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>

            <div className="flex flex-col gap-3 text-sm">
              <Link
                to="/"
                className="text-slate-300 hover:text-green-400 transition"
              >
                Home
              </Link>

              <Link
                to="/search"
                className="text-slate-300 hover:text-green-400 transition"
              >
                Search Properties
              </Link>

              <Link
                to="/about"
                className="text-slate-300 hover:text-green-400 transition"
              >
                About Us
              </Link>

              <Link
                to="/profile"
                className="text-slate-300 hover:text-green-400 transition"
              >
                Profile
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>

            <div className="flex flex-col gap-3 text-sm text-slate-300">
              <p className="flex items-center gap-2">
                <FaHome className="text-green-500" />
                Lahore, Pakistan
              </p>

              <p className="flex items-center gap-2">
                <FaEnvelope className="text-green-500" />
                info@sahandestate.com
              </p>

              <p className="flex items-center gap-2">
                <FaPhone className="text-green-500" />
                +92 300 1234567
              </p>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>

            <p className="text-slate-300 text-sm mb-4">
              Follow us on social media for the latest properties and updates.
            </p>

            <div className="flex gap-4">
              <a
                href="#"
                className="text-slate-300 hover:text-blue-500 text-xl transition"
              >
                <FaFacebook />
              </a>

              <a
                href="#"
                className="text-slate-300 hover:text-pink-500 text-xl transition"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="text-slate-300 hover:text-sky-400 text-xl transition"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-600 mt-8 pt-6 text-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Sahand Estate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
