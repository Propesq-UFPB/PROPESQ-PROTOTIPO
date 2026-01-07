// src/pages/CertificateView.tsx - não utilizado atualmente

import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import {
  BadgeCheck,
  FileText,
  ShieldCheck,
  Share2,
  ExternalLink,
  Printer,
  Link as LinkIcon,
  Copy,
  Check,
} from 'lucide-react';
import Card from '@/components/Card';
import { Helmet } from 'react-helmet'

export default function CertificateView() {
  const { id } = useParams<{ id: string }>();
  const code = useMemo(() => `UFPB-C-${id?.padStart(4, '0')}-VALIDO`, [id]);
  const url = useMemo(() => `https://pibic.ufpb.br/validar/${id}`, [id]);

  const [copied, setCopied] = useState<'code' | 'url' | null>(null);

  async function copy(text: string, type: 'code' | 'url') {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 1400);
    } catch {
      /* noop */
    }
  }

  function handlePrint() {
    window.print();
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Verificação de Certificado – UFPB',
          text: `Código: ${code}`,
          url,
        });
      } catch {
        /* cancelado */
      }
    } else {
      copy(url, 'url');
    }
  }

  return (
    <div className="page-cert-view">
        {/* Faixa superior */}
        <header>
          <ShieldCheck />
          <h1>Verificação de Certificado</h1>
        </header>

        <section>
          {/* Topo do certificado */}
          <div className="cv-top">
            <BadgeCheck className="sigla" />
            <div className="left">
              <img src="/favicon.ico" alt="Brasão" className="brasao" />
              <div className="org">
                <div className="u">Universidade Federal da Paraíba (UFPB)</div>
                <div className="p">Pró-Reitoria de Pesquisa</div>
              </div>
            </div>
          </div>

          <hr />

          {/* Corpo: detalhes + QR */}
          <div className="cv-grid">
            {/* Coluna principal */}
            <div className="cv-details">
              <h2 className="cv-h2">
                <FileText className="ico" />
                Detalhes da Participação
              </h2>

              <div className="cv-table">
                <div className="head">
                  <span>Item</span>
                  <span>Descrição</span>
                </div>
                <div className="row">
                  <div className="cell key">Participante</div>
                  <div className="cell">Discente Exemplo</div>
                </div>
                <div className="row">
                  <div className="cell key">Projeto</div>
                  <div className="cell">Título Exemplo</div>
                </div>
                <div className="row">
                  <div className="cell key">Período</div>
                  <div className="cell">2024–2025</div>
                </div>
              </div>

              <h2 className="cv-h2">
                <ShieldCheck className="ico" />
                Status e Validação
              </h2>

              <div className="cv-table">
                <div className="head">
                  <span>Item</span>
                  <span>Detalhe</span>
                </div>
                <div className="row">
                  <div className="cell key">Código</div>
                  <div className="cell mono">{code}</div>
                </div>
                <div className="row">
                  <div className="cell key">Status</div>
                  <div className="cell">
                    <span className="badge-valid">Válido (Autenticado)</span>
                  </div>
                </div>
                <div className="row">
                  <div className="cell key">URL</div>
                  <div className="cell">
                    <a href={url} target="_blank" rel="noreferrer">
                      {url}
                    </a>
                  </div>
                </div>
              </div>

              <div className="tip">
                <strong>Dica:</strong> a autenticidade pode ser verificada instantaneamente pelo
                código QR ou pela URL acima.
              </div>
            </div>

            {/* QR (coluna direita) */}
            <aside className="cv-aside">
              <div className="qr-wrap">
                <div className="qr-box">
                  <QRCode value={url} size={156} bgColor="#ffffff" />
                </div>
                <div className="qr-legend">Leia o QR Code</div>
              </div>
            </aside>
          </div>

          <hr />

          {/* Ações rápidas */}
          <div className="cv-actions">
            <h2 className="cv-h2">
              <Share2 className="ico" />
              Ações Rápidas
            </h2>

            <div className="table3">
              <div className="head">
                <span>Ação</span>
                <span>Descrição</span>
                <span>Botão</span>
              </div>

              <div className="row">
                <div className="a">
                  <Printer />
                  Imprimir Certificado
                </div>
                <div className="desc">Gera versão pronta para impressão</div>
                <button className="pill-btn" onClick={handlePrint}>Print</button>
              </div>

              <div className="row">
                <div className="a">
                  <Share2 />
                  Compartilhar
                </div>
                <div className="desc">Envia pelo recurso nativo do dispositivo</div>
                <button className="pill-btn" onClick={handleShare}>Share</button>
              </div>

              <div className="row">
                <div className="a">
                  <ExternalLink />
                  Abrir Validação
                </div>
                <div className="desc">Acessa a página oficial de conferência</div>
                <a href={url} target="_blank" rel="noreferrer" className="pill-btn">Abrir</a>
              </div>

              <div className="row">
                <div className="a">
                  <LinkIcon />
                  Copiar Link
                </div>
                <div className="desc">Copia a URL de validação</div>
                <button className="pill-btn" onClick={() => copy(url, 'url')}>
                  {copied === 'url' ? <Check /> : <Copy />} {copied === 'url' ? 'Copiado' : 'Copiar'}
                </button>
              </div>
            </div>

            <p className="note">
              <em>Tips:</em> em dispositivos sem suporte ao compartilhamento nativo, a URL será
              copiada. Para diretrizes mobile, consulte a documentação institucional.
            </p>
          </div>
        </section>
    </div>
  )
}
