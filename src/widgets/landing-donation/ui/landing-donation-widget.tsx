"use client";

import { useTranslation } from "@fsd/shared/i18n/use-translation";
import { useDonationAnimation } from "../model/use-donation-animation";

export const LandingDonationWidget = () => {
  const { t } = useTranslation();
  const { containerRef, buttonRef } = useDonationAnimation();

  return (
    <section
      ref={containerRef}
      className="py-20 bg-background border-t border-gray/40"
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="max-w-3xl mx-auto p-10 rounded-2xl bg-primary-gray border border-gray text-center relative overflow-hidden">
          <span className="text-xs font-semibold tracking-wider text-blue uppercase">
            {t("landing.donation.tag")}
          </span>
          <h2 className="text-h3 font-bold text-foreground mt-2 mb-4">
            {t("landing.donation.title")}
          </h2>
          <p className="text-p-sm text-lighter-gray mb-8 max-w-xl mx-auto">
            {t("landing.donation.description")}
          </p>

          <a
            ref={buttonRef}
            href="https://www.paypal.com/donate/?hosted_button_id=LF7NX3KCMKBH8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3.5 rounded-md bg-blue text-[#ffffff] dark:text-white font-medium hover:bg-blue/90 transition-colors shadow-lg shadow-blue/25"
          >
            {t("landing.donation.cta")}
          </a>
        </div>
      </div>
    </section>
  );
};
