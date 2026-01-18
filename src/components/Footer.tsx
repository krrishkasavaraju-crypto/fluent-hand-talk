import { Hand, Heart } from "lucide-react";

const Footer = () => {
  const companyLinks = [
    { label: "About Us", href: "#about" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Press", href: "#" },
  ];

  const teamMembers = [
    { name: "Carlos Tello Dominguez", role: "Co-Founder & Developer" },
    { name: "Krishna Kasavaraju", role: "Co-Founder & Developer" },
    { name: "Elena Jin", role: "Co-Founder & Developer" },
  ];

  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Brand column */}
          <div>
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                <Hand className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                ASL Bridge
              </span>
            </a>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Breaking barriers between Deaf and hearing communities with AI-powered real-time translation.
            </p>
          </div>

          {/* Company column */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About Us / Team column */}
          <div id="about">
            <h4 className="font-semibold text-foreground mb-4">Our Team</h4>
            <ul className="space-y-3">
              {teamMembers.map((member) => (
                <li key={member.name} className="text-muted-foreground">
                  <span className="block font-medium text-foreground">{member.name}</span>
                  <span className="text-sm">{member.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 ASL Bridge. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-accent fill-current" /> for the Deaf community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;