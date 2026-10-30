import React, { useState } from "react";
import { Award, ExternalLink, Eye, X, FileText } from "lucide-react";
import { MotionReveal } from "../common/MotionReveal";
import { Certificate } from "../../types";

interface CertificatesSectionProps {
  certificates: Certificate[];
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({ certificates }) => {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  // Only display visible certificates on the public site
  const visibleCertificates = certificates.filter((c) => c.is_visible);

  if (visibleCertificates.length === 0) {
    return null; // Cleanly hide on public site per instructions until Wiame uploads certificates in admin
  }

  return (
    <section id="certificates" className="py-24 border-t border-line-light/80 dark:border-line-dark/80 bg-surface-light/30 dark:bg-surface-dark/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <MotionReveal>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-majorelle dark:bg-majorelle-dark" />
            <span className="font-heading font-bold text-xs uppercase tracking-widest text-majorelle dark:text-majorelle-dark">
              Credentials &amp; Specializations
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-ink dark:text-ink-dark mb-4">
            Professional Certifications
          </h2>
          <p className="text-base text-muted-light dark:text-muted-dark max-w-[65ch] mb-16">
            Verified course certifications across machine learning, cloud infrastructure, and big data architectures.
          </p>
        </MotionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleCertificates.map((cert, index) => (
            <MotionReveal key={cert.id} delay={index * 0.1}>
              <div className="p-6 rounded-2xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark shadow-sm hover:border-majorelle/50 dark:hover:border-majorelle-dark/50 transition-all flex flex-col justify-between h-full group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-majorelle-light dark:bg-majorelle-darkSurface flex items-center justify-center text-majorelle dark:text-majorelle-dark mb-4 group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-saffron dark:text-saffron-dark uppercase tracking-wider block mb-1">
                    {cert.issuer}
                  </span>
                  <h3 className="font-heading font-bold text-lg text-ink dark:text-ink-dark mb-2">
                    {cert.title}
                  </h3>
                  {cert.issue_date && (
                    <p className="text-xs text-muted-light dark:text-muted-dark font-mono">
                      Issued: {cert.issue_date}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-6 border-t border-line-light/60 dark:border-line-dark/60 flex items-center justify-between text-xs">
                  {cert.image_url || cert.pdf_url ? (
                    <button
                      onClick={() => setSelectedCert(cert)}
                      type="button"
                      className="inline-flex items-center gap-1.5 font-semibold text-majorelle dark:text-majorelle-dark hover:underline"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                  ) : (
                    <span className="text-muted-light dark:text-muted-dark italic">
                      Verified
                    </span>
                  )}

                  {cert.verification_url && (
                    <a
                      href={cert.verification_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-muted-light dark:text-muted-dark hover:text-majorelle dark:hover:text-majorelle-dark transition-colors"
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </MotionReveal>
          ))}
        </div>

        {/* Modal Lightbox for Certificate preview */}
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <div className="relative max-w-2xl w-full rounded-2xl bg-surface-light dark:bg-surface-dark border border-line-light dark:border-line-dark p-6 shadow-2xl">
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 p-2 rounded-xl text-muted-light dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark hover:bg-canvas-light dark:hover:bg-canvas-dark transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-heading font-bold text-xl text-ink dark:text-ink-dark mb-1">
                {selectedCert.title}
              </h3>
              <p className="text-xs text-muted-light dark:text-muted-dark mb-4">
                Issued by {selectedCert.issuer}
              </p>

              <div className="max-h-[65vh] overflow-auto rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark flex items-center justify-center p-4">
                {selectedCert.image_url ? (
                  <img
                    src={selectedCert.image_url}
                    alt={selectedCert.title}
                    className="max-h-[60vh] object-contain rounded-lg shadow-sm"
                  />
                ) : selectedCert.pdf_url ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-majorelle mx-auto mb-3" />
                    <p className="text-sm font-semibold mb-4 text-ink dark:text-ink-dark">
                      PDF Document Available
                    </p>
                    <a
                      href={selectedCert.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-majorelle text-white text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <span>Open Document in New Tab</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-muted-light dark:text-muted-dark py-12">
                    Preview not available.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
