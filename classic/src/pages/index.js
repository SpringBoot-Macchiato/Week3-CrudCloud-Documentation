import React from 'react';
import Layout from '@theme/Layout';
import './index.css';

export default function Home() {
  return (
    <Layout>
      <div className="home-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">CrudCloud Documentation</h1>
            <p className="hero-description">
              Documentación técnica completa del proyecto
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="section-content">
            <h2 className="section-title">Características Principales</h2>
            <div className="features-grid">
              <div className="feature-item">
                <h3 className="feature-title">Fácil de Usar</h3>
                <p className="feature-description">
                  Interfaces intuitiva y documentación clara para desarrolladores de todos los niveles
                </p>
              </div>
             
              <div className="feature-item">
                <h3 className="feature-title">Alto Rendimiento</h3>
                <p className="feature-description">
                  Arquitectura optimizada para máxima eficiencia y escalabilidad en producción
                </p>
              </div>
             
              <div className="feature-item">
                <h3 className="feature-title">Flexible</h3>
                <p className="feature-description">
                  Adaptable a diferentes necesidades, entornos y casos de uso empresarial
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
