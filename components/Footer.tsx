import Image from 'next/image'
import Link from 'next/link'
import { FacebookIcon, TwitterIcon, LinkedinIcon, InstagramIcon, MapPinIcon, PhoneIcon, MailIcon } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center md:text-left">
            <Image src="/csi_logo.png" alt="CSI Logo" width={60} height={60} className="mx-auto md:mx-0 mb-4 bg-white rounded-full" />
            <h3 className="text-xl font-semibold mb-2 text-blue-300">CSI SRMIST</h3>
            <p className="text-sm text-blue-200">Computer Society of India - SRMIST Delhi-NCR Campus</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-blue-200 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/#about" className="text-blue-200 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/#faculty" className="text-blue-200 hover:text-white transition-colors">Faculty</Link></li>
              <li><Link href="/#events" className="text-blue-200 hover:text-white transition-colors">Events</Link></li>
              <li><Link href="/team" className="text-blue-200 hover:text-white transition-colors">Team</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-blue-200">
                <MapPinIcon className="mr-2 h-5 w-5" />
                <span>SRMIST, Delhi-NCR Campus, Delhi-Meerut Road, Modinagar, Ghaziabad, Uttar Pradesh 201204</span>
              </li>
              <li className="flex items-center text-blue-200">
                <PhoneIcon className="mr-2 h-5 w-5" />
                <span>+91 1234567890</span>
              </li>
              <li className="flex items-center text-blue-200">
                <MailIcon className="mr-2 h-5 w-5" />
                <span>csi@srmist.edu.in</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Connect With Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <SocialIcon href="#" icon={<FacebookIcon />} />
              <SocialIcon href="#" icon={<TwitterIcon />} />
              <SocialIcon href="#" icon={<LinkedinIcon />} />
              <SocialIcon href="#" icon={<InstagramIcon />} />
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-blue-200">
          &copy; {new Date().getFullYear()} Computer Society of India - SRMIST Delhi-NCR Campus. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

interface SocialIconProps {
  href: string;
  icon: React.ReactNode;
}

const SocialIcon = ({ href, icon }: SocialIconProps) => (
  <a href={href} className="text-blue-300 hover:text-white transition-colors">
    {icon}
  </a>
)