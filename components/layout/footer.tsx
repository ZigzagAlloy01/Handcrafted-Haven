"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavbarAuth } from "@/lib/navbar/use-navbar-auth";
import "./footer.css";

function FooterSkeleton() {
  return (
    <footer className="footer footer-skeleton">
      <div className="footer-container container">
        <div className="footer-skeleton-block footer-skeleton-brand" />
        <div className="footer-skeleton-links">
          <div className="footer-skeleton-column">
            <div className="footer-skeleton-line short" />
            <div className="footer-skeleton-line" />
            <div className="footer-skeleton-line" />
            <div className="footer-skeleton-line" />
          </div>

          <div className="footer-skeleton-column">
            <div className="footer-skeleton-line short" />
            <div className="footer-skeleton-line" />
            <div className="footer-skeleton-line" />
            <div className="footer-skeleton-line" />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Handcrafted Haven. All rights reserved.</p>
      </div>
    </footer>
  );
}

function MinimalFooter() {
  return (
    <footer className="footer footer-minimal">
      <div className="footer-bottom">
        <p>© 2026 Handcrafted Haven. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const { profile, loadingUser } = useNavbarAuth(() => {});
  const isAdmin = profile?.role === "admin";
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoggedIn = !!profile;

  if (loadingUser) {
    return isAdminRoute ? <MinimalFooter /> : <FooterSkeleton />;
  }

  if (isAdmin) {
    return <MinimalFooter />;
  }

  return (
    <footer className="footer">
      <div className="footer-container container">
        <div className="footer-brand">
          <h3>Handcrafted Haven</h3>
          <p>
            A welcoming marketplace where artisans share handmade creations and
            shoppers discover meaningful, one-of-a-kind goods.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link href="/shop">Shop</Link></li>
              <li><Link href="/artisans">Artisans</Link></li>
              <li><Link href="/about">About</Link></li>
            </ul>
          </div>

          <div>
            <h4>Support</h4>
            <ul>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              {!isLoggedIn && (
                <li><Link href="/register">Sign Up</Link></li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Handcrafted Haven. All rights reserved.</p>
      </div>
    </footer>
  );
}