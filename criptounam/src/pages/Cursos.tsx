import React from 'react'

const Cursos = () => {
  return (
    <div className="courses-page">
      <header className="page-header">
        <h1>Recursos Educativos</h1>
        <p>Explora nuestro contenido educativo organizado por temas</p>
        <div className="search-bar">
          <input type="text" placeholder="Buscar recursos..." />
          <button><i className="fas fa-search"></i></button>
        </div>
      </header>

      <div className="courses-container">
        {/* Filtros */}
        <aside className="filters-sidebar">
          <h3>Filtros</h3>
          <div className="filter-group">
            <h4>Nivel</h4>
            <label><input type="checkbox" /> Principiante</label>
            <label><input type="checkbox" /> Intermedio</label>
            <label><input type="checkbox" /> Avanzado</label>
          </div>
          <div className="filter-group">
            <h4>Tipo</h4>
            <label><input type="checkbox" /> Video</label>
            <label><input type="checkbox" /> Artículo</label>
            <label><input type="checkbox" /> Curso</label>
          </div>
        </aside>

        <div className="courses-grid">
          {/* Blockchain Básico */}
          <section className="course-category">
            <div className="category-header">
              <h2>Blockchain Básico</h2>
              <span className="course-count">2 recursos</span>
            </div>
            <div className="resources-list">
              <div className="resource-card">
                <div className="resource-header">
                  <div className="resource-icon">
                    <i className="fas fa-book"></i>
                  </div>
                  <span className="difficulty beginner">Principiante</span>
                </div>
                <div className="resource-content">
                  <h3>Introducción a Blockchain</h3>
                  <p>Fundamentos y conceptos básicos de la tecnología blockchain</p>
                </div>
                <div className="resource-footer">
                  <span className="duration"><i className="far fa-clock"></i> 2 horas</span>
                  <a href="#" className="resource-link">Ver recurso</a>
                </div>
              </div>

              <div className="resource-card">
                <div className="resource-header">
                  <div className="resource-icon">
                    <i className="fas fa-video"></i>
                  </div>
                  <span className="difficulty intermediate">Intermedio</span>
                </div>
                <div className="resource-content">
                  <h3>Criptoeconomía</h3>
                  <p>Conceptos económicos fundamentales en blockchain</p>
                </div>
                <div className="resource-footer">
                  <span className="duration"><i className="far fa-clock"></i> 1.5 horas</span>
                  <a href="#" className="resource-link">Ver recurso</a>
                </div>
              </div>
            </div>
          </section>

          {/* DeFi */}
          <section className="course-category">
            <div className="category-header">
              <h2>DeFi (Finanzas Descentralizadas)</h2>
              <span className="course-count">2 recursos</span>
            </div>
            <div className="resources-list">
              <div className="resource-card">
                <div className="resource-header">
                  <div className="resource-icon">
                    <i className="fas fa-university"></i>
                  </div>
                  <span className="difficulty beginner">Principiante</span>
                </div>
                <div className="resource-content">
                  <h3>Fundamentos DeFi</h3>
                  <p>Introducción a las finanzas descentralizadas y protocolos DeFi</p>
                </div>
                <div className="resource-footer">
                  <span className="duration"><i className="far fa-clock"></i> 3 horas</span>
                  <a href="#" className="resource-link">Ver recurso</a>
                </div>
              </div>

              <div className="resource-card">
                <div className="resource-header">
                  <div className="resource-icon">
                    <i className="fas fa-exchange-alt"></i>
                  </div>
                  <span className="difficulty intermediate">Intermedio</span>
                </div>
                <div className="resource-content">
                  <h3>DEX y AMMs</h3>
                  <p>Exchanges descentralizados y market makers automáticos</p>
                </div>
                <div className="resource-footer">
                  <span className="duration"><i className="far fa-clock"></i> 2.5 horas</span>
                  <a href="#" className="resource-link">Ver recurso</a>
                </div>
              </div>
            </div>
          </section>

          {/* Desarrollo */}
          <section className="course-category">
            <div className="category-header">
              <h2>Desarrollo Web3</h2>
              <span className="course-count">2 recursos</span>
            </div>
            <div className="resources-list">
              <div className="resource-card">
                <div className="resource-header">
                  <div className="resource-icon">
                    <i className="fas fa-code"></i>
                  </div>
                  <span className="difficulty intermediate">Intermedio</span>
                </div>
                <div className="resource-content">
                  <h3>Solidity Básico</h3>
                  <p>Aprende a programar smart contracts desde cero</p>
                </div>
                <div className="resource-footer">
                  <span className="duration"><i className="far fa-clock"></i> 4 horas</span>
                  <a href="#" className="resource-link">Ver recurso</a>
                </div>
              </div>

              <div className="resource-card">
                <div className="resource-header">
                  <div className="resource-icon">
                    <i className="fas fa-laptop-code"></i>
                  </div>
                  <span className="difficulty advanced">Avanzado</span>
                </div>
                <div className="resource-content">
                  <h3>dApps con React</h3>
                  <p>Desarrollo de aplicaciones descentralizadas con React y Web3.js</p>
                </div>
                <div className="resource-footer">
                  <span className="duration"><i className="far fa-clock"></i> 5 horas</span>
                  <a href="#" className="resource-link">Ver recurso</a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="progress-tracker">
        <h3>Tu Progreso</h3>
        <div className="progress-bar">
          <div className="progress" style={{width: '60%'}}>60%</div>
        </div>
        <p>Has completado 6 de 10 recursos</p>
      </div>
    </div>
  )
}

export default Cursos 