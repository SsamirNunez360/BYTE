'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Course } from '../data/courses';
import YearBlock from '../components/YearBlock';
import Settings from '../components/Settings';
import RecommendationEngine from '../components/RecommendationEngine';
import AcademicStats from '../components/AcademicStats';
import { useAcademicStatus } from '../hooks/useAcademicStatus';
import { useCourseCatalog } from '../hooks/useCourseCatalog';
import CourseSelectionView from '../components/CourseSelectionView';

// Usuarios autenticados
const USERS: Record<string, { password: string; newUser: boolean }> = {
  '20232300089': { password: '123456789', newUser: false },
  '20232300090': { password: '123456789', newUser: true },
  '20212320057': { password: '123456789', newUser: false },
  '20242300084': { password: '123456789', newUser: false },
};

const ACCOUNT_RESET_VERSIONS: Record<string, string> = {
  '20232300090': 'manual-selection-reset-v2',
};

const MANUAL_SELECTION_COMPLETED_PREFIX = 'manualSelectionCompleted_';

type AppState = 'login' | 'register' | 'dashboard' | 'select-courses' | 'select-current-courses' | 'select-courses-per-period';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('login');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const isCurrentUserNew = false; // El estado de nuevo usuario ahora viene de la API en el login

  const { 
    approvedCourses, 
    currentCourses: dynamicCurrentCourses,
    toggleApproved, 
    toggleCurrent,
    replaceApprovedCourses,
    replaceCurrentCourses
  } = useAcademicStatus(currentUser, {
    startEmpty: isCurrentUserNew,
  });

  const { years } = useCourseCatalog();

  // Estados para nuevo usuario y dashboard
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [selectedCurrentCourses, setSelectedCurrentCourses] = useState<Set<string>>(new Set());
  const [coursesPerPeriod, setCoursesPerPeriod] = useState(4);
  const [theme, setTheme] = useState('light');
  const [courseSearch, setCourseSearch] = useState('');
  const [showCoursesPerPeriodDialog, setShowCoursesPerPeriodDialog] = useState(false);
  const [suggestedPlan, setSuggestedPlan] = useState<{ period: string; courses: Course[] }[]>([]);
  const [completionYear, setCompletionYear] = useState<number | null>(null);
  const [completionPeriod, setCompletionPeriod] = useState<string | null>(null);



  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`coursesPerPeriod_${currentUser}`);
      if (saved) {
        setCoursesPerPeriod(parseInt(saved));
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`coursesPerPeriod_${currentUser}`, coursesPerPeriod.toString());
    }
  }, [coursesPerPeriod, currentUser]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const applyAccountResetIfNeeded = (accountId: string) => {
    const resetVersion = ACCOUNT_RESET_VERSIONS[accountId];
    if (!resetVersion) return;

    const markerKey = `accountReset_${accountId}`;
    const appliedVersion = localStorage.getItem(markerKey);
    if (appliedVersion === resetVersion) return;

    localStorage.removeItem(`approvedCourses_${accountId}`);
    localStorage.removeItem(`coursesPerPeriod_${accountId}`);
    localStorage.removeItem(`${MANUAL_SELECTION_COMPLETED_PREFIX}${accountId}`);
    localStorage.setItem(markerKey, resetVersion);
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userTrimmed = userId.trim();
    
    console.log('[LOGIN] Iniciando login para usuario:', userTrimmed);
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', userId: userTrimmed, password })
      });

      console.log('[LOGIN] Response status:', response.status, 'ok:', response.ok);

      if (response.ok) {
        const { user } = await response.json();
        console.log('[LOGIN] Usuario autenticado:', user);
        
        setCurrentUser(user.id);
        setLoginError('');
        setSelectedCourses(new Set());
        setCourseSearch('');
        
        const needsManualSelection = user.isNewUser && !user.manualSelectionCompleted;
        console.log('[LOGIN] needsManualSelection:', needsManualSelection);
        console.log('[LOGIN] Cambiar appState a:', needsManualSelection ? 'select-courses' : 'dashboard');
        
        setAppState(needsManualSelection ? 'select-courses' : 'dashboard');
      } else {
        const data = await response.json();
        console.log('[LOGIN] Error en autenticación:', data.error);
        setLoginError(data.error || 'Número de cuenta o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('[LOGIN] Exception:', error);
      setLoginError('Error de conexión con el servidor.');
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userTrimmed = userId.trim();
    
    if (userTrimmed.length < 5) {
      setLoginError('El número de cuenta debe ser válido.');
      return;
    }
    
    if (password.length < 4) {
      setLoginError('La contraseña es demasiado corta.');
      return;
    }

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', userId: userTrimmed, password })
      });

      if (response.ok) {
        setLoginError('');
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        setAppState('login');
      } else {
        const data = await response.json();
        setLoginError(data.error || 'Error al registrar usuario.');
      }
    } catch (error) {
      setLoginError('Error de conexión con el servidor.');
    }
  };

  const handleLogout = () => {
    setAppState('login');
    setUserId('');
    setPassword('');
    setLoginError('');
    setCurrentUser(null);
    setSelectedCourses(new Set());
  };

  const handleEditHistory = () => {
    setSelectedCourses(new Set(approvedCourses));
    setSelectedCurrentCourses(new Set(dynamicCurrentCourses));
    setAppState('select-courses');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const allCourses = useMemo(() => years.flatMap(y => y.periods.flatMap(p => p.courses)), [years]);

  const totalCourses = allCourses.length;
  const approvedCount = approvedCourses.size;
  const currentCoursesCount = dynamicCurrentCourses.size;
  const pendingCourses = allCourses.filter(c => !approvedCourses.has(c.code) && !dynamicCurrentCourses.has(c.code));
  
  const approvedPercentage = totalCourses > 0
    ? Math.round((approvedCount + currentCoursesCount * 0.5) / totalCourses * 100)
    : 0;
  const approvedCA = allCourses.filter(c => approvedCourses.has(c.code)).reduce((sum, c) => sum + c.ca, 0);
  const currentCA = allCourses.filter(c => dynamicCurrentCourses.has(c.code)).reduce((sum, c) => sum + c.ca, 0);

  const suggestPlan = () => {
    // Obtener fecha actual para determinar período actual
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    let currentPeriod = 1;
    if (currentMonth >= 5 && currentMonth <= 8) currentPeriod = 2;
    else if (currentMonth >= 9 && currentMonth <= 12) currentPeriod = 3;
    // Enero-Abril = P1, Mayo-Agosto = P2, Sept-Dic = P3

    // Calcular año académico actual basado en cursos aprobados
    let currentYear = 1;
    let cumulativeCourses = 0;
    for (const year of years) {
      const yearCourses = year.periods.flatMap(p => p.courses).length;
      cumulativeCourses += yearCourses;
      if (approvedCount < cumulativeCourses) {
        break;
      }
      currentYear = year.year;
    }

    // Mapear a año calendario actual
    const currentYearCalendario = now.getFullYear();

    // Generar plan completo de sugerencias empezando desde el próximo período
    const plan: { period: string; courses: Course[] }[] = [];
    let remainingPending = [...pendingCourses];
    let currentPlanPeriod = currentPeriod + 1; // Empezar desde el próximo período
    let currentPlanYear = currentYearCalendario;
    if (currentPlanPeriod > 3) {
      currentPlanPeriod = 1;
      currentPlanYear++;
    }
    const periodNames = ['P1 (Enero-Abril)', 'P2 (Mayo-Agosto)', 'P3 (Septiembre-Diciembre)'];

    // Iniciar con las clases actualmente aprobadas y en curso
    const simulatedApproved = new Set([
      ...Array.from(approvedCourses),
      ...Array.from(dynamicCurrentCourses)
    ]);

    while (remainingPending.length > 0) {
      // Filtrar las clases que ya tienen todos sus pre-requisitos en 'simulatedApproved'
      let availableCourses = remainingPending.filter(course =>
        course.prerequisites.every(prereq => simulatedApproved.has(prereq))
      );

      // Mecanismo de seguridad: Si hay un cuello de botella o dependencia no satisfecha que bloquea todo, tomamos simplemente las siguientes clases para evitar un bucle infinito
      if (availableCourses.length === 0) {
        availableCourses = remainingPending;
      }

      const coursesForPeriod = availableCourses.slice(0, coursesPerPeriod);
      const periodLabel = `${periodNames[currentPlanPeriod - 1]} ${currentPlanYear}`;
      plan.push({ period: periodLabel, courses: coursesForPeriod });

      // Marcar las clases recién seleccionadas como aprobadas para el siguiente período
      coursesForPeriod.forEach(c => simulatedApproved.add(c.code));

      // Removerlas de la lista de pendientes
      const selectedCodes = new Set(coursesForPeriod.map(c => c.code));
      remainingPending = remainingPending.filter(c => !selectedCodes.has(c.code));

      // Avanzar al siguiente período
      currentPlanPeriod++;
      if (currentPlanPeriod > 3) {
        currentPlanPeriod = 1;
        currentPlanYear++;
      }
    }

    setSuggestedPlan(plan);

    // Calcular finalización basada en el plan
    if (plan.length > 0) {
      const lastPeriod = plan[plan.length - 1];
      const yearMatch = lastPeriod.period.match(/(\d{4})$/);
      const finalYear = yearMatch ? parseInt(yearMatch[1]) : currentYearCalendario;
      setCompletionYear(finalYear);
      setCompletionPeriod(lastPeriod.period.split(' ')[0] + ' ' + lastPeriod.period.split(' ')[1]);
    } else {
      setCompletionYear(currentYearCalendario);
      setCompletionPeriod(periodNames[currentPeriod - 1]);
    }
  };

  useEffect(() => {
    if (appState === 'dashboard') {
      suggestPlan();
    }
  }, [appState, approvedCourses, coursesPerPeriod]);

  if (appState === 'login') {
    return (
      <main className="login-page auth-login-page">
        <div className="login-shell login-shell-single">
          <div className="login-card login-auth-card">
            <div className="login-card-header">
              <span className="login-eyebrow">Acceso estudiantil</span>
              <h1>Iniciar sesión</h1>
              <p>Ingresa tu número de cuenta y contraseña para acceder a tu plan académico personalizado.</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              <div className="login-input-group">
                <label htmlFor="user-id">Número de cuenta</label>
                <input
                  id="user-id"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="login-input"
                  placeholder="20232300089"
                  autoComplete="username"
                />
              </div>
              <div className="login-input-group">
                <label htmlFor="password">Contraseña</label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                    placeholder="*********"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                        <line x1="2" y1="2" x2="22" y2="22"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {loginError && <div className="login-error">{loginError}</div>}
              <button 
                type="submit"
                className="login-button"
              >
                Entrar al plan
              </button>
            </form>

            <div className="login-footnote">
              <p>¿No tienes una cuenta? <button onClick={() => { setAppState('register'); setLoginError(''); }} className="register-btn" aria-label="Registrarse">Regístrate aquí</button></p>
              <p className="mt-2">Usa tu cuenta institucional o las de prueba para revisar el flujo.</p>
            </div>

            <style jsx>{` 
              .register-btn {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                background: linear-gradient(90deg, var(--unah-blue), #2b8cff);
                color: white;
                border: none;
                border-radius: 10px;
                font-weight: 700;
                cursor: pointer;
                box-shadow: 0 6px 14px rgba(43,140,255,0.18);
                transition: transform 0.12s ease, box-shadow 0.12s ease, opacity 0.12s ease;
                text-decoration: none;
                font-size: 14px;
              }

              .register-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 24px rgba(43,140,255,0.2);
              }

              .register-btn:active { transform: translateY(0); }

              .register-btn:focus {
                outline: 3px solid rgba(43,140,255,0.18);
                outline-offset: 2px;
              }

              @media (prefers-reduced-motion: reduce) {
                .register-btn { transition: none; transform: none; }
              }
            `}</style>
          </div>
        </div>
      </main>
    );
  }

  if (appState === 'register') {
    return (
      <main className="login-page auth-login-page">
        <div className="login-shell login-shell-single">
          <div className="login-card login-auth-card">
            <div className="login-card-header">
              <span className="login-eyebrow">Registro de estudiante</span>
              <h1>Crear cuenta</h1>
              <p>Regístrate para empezar a gestionar tu plan académico de Ingeniería en Sistemas.</p>
            </div>

            <form onSubmit={handleRegister} className="login-form">
              <div className="login-input-group">
                <label htmlFor="reg-user-id">Número de cuenta</label>
                <input
                  id="reg-user-id"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="login-input"
                  placeholder="Ej: 20212320057"
                  required
                />
              </div>
              <div className="login-input-group">
                <label htmlFor="reg-password">Contraseña</label>
                <input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  placeholder="Mínimo 4 caracteres"
                  required
                />
              </div>
              {loginError && <div className="login-error">{loginError}</div>}
              <button type="submit" className="login-button">Registrarme</button>
              <button 
                type="button" 
                onClick={() => { setAppState('login'); setLoginError(''); }} 
                className="login-button secondary"
                style={{ marginTop: '10px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                Volver al inicio
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  if (appState === 'select-courses') {
    return (
      <main className="login-page" style={{ width: '100%', maxWidth: '100%' }}>
        <CourseSelectionView
          title="Materias Aprobadas"
          subtitle="Selecciona las materias que ya has completado en la carrera."
          selectedCourses={selectedCourses}
          setSelectedCourses={setSelectedCourses}
          courseSearch={courseSearch}
          setCourseSearch={setCourseSearch}
          selectionType="approved"
          years={years}
          onContinue={() => {
            replaceApprovedCourses(selectedCourses);
            setAppState('select-current-courses');
          }}
        />
      </main>
    );
  }

  if (appState === 'select-current-courses') {
    return (
      <main className="login-page" style={{ width: '100%', maxWidth: '100%' }}>
        <CourseSelectionView
          title="Materias en Curso"
          subtitle="¿Qué materias estás llevando en este período actual?"
          selectedCourses={selectedCurrentCourses}
          setSelectedCourses={setSelectedCurrentCourses}
          courseSearch={courseSearch}
          setCourseSearch={setCourseSearch}
          selectionType="current"
          excludeCourses={approvedCourses}
          years={years}
          onContinue={async () => {
            replaceCurrentCourses(selectedCurrentCourses);
            if (currentUser) {
              await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'update-onboarding', userId: currentUser })
              });
            }
            setAppState('select-courses-per-period');
          }}
        />
      </main>
    );
  }

  if (appState === 'select-courses-per-period') {
    return (
      <main className="login-page">
        <div className="courses-per-period-glass">
          <div className="stepper">
            <div className="step approved">✓</div>
            <div className="step-line approved"></div>
            <div className="step active">2</div>
          </div>
          
          <h1>Configuración de Carga Académica</h1>
          <p>¿Cuántas clases planeas llevar en promedio cada período?</p>
          
          <div className="selection-content">
            <div className="load-selector">
              {[3, 4, 5, 6].map(num => (
                <button 
                  key={num}
                  onClick={() => setCoursesPerPeriod(num)}
                  className={`load-btn ${coursesPerPeriod === num ? 'active' : ''}`}
                >
                  <span className="num">{num}</span>
                  <span className="label">Asignaturas</span>
                </button>
              ))}
              <div className="custom-load">
                <label>Otro valor:</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={coursesPerPeriod}
                  onChange={(e) => setCoursesPerPeriod(Math.max(1, parseInt(e.target.value) || 1))}
                  className="custom-input"
                />
              </div>
            </div>
            
          <div className="summary-box">
            <div className="summary-item">
              <span className="s-label">Aprobadas:</span>
              <span className="s-value">{approvedCourses.size}</span>
            </div>
            <div className="summary-item">
              <span className="s-label">En Curso:</span>
              <span className="s-value">{dynamicCurrentCourses.size}</span>
            </div>
            <div className="summary-item">
              <span className="s-label">Carga:</span>
              <span className="s-value">{coursesPerPeriod} / per</span>
            </div>
          </div>
          </div>

          <button
            type="button"
            onClick={() => setAppState('dashboard')}
            className="finish-btn"
          >
            <span>Finalizar Configuración</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7"/>
            </svg>
          </button>
        </div>

        <style jsx>{`
          .courses-per-period-glass {
            max-width: 1200px;
            width: 96%;
            margin: 10px auto;
            background: var(--glass-bg);
            backdrop-filter: var(--glass-backdrop);
            border: 1px solid var(--glass-border);
            border-radius: 32px;
            padding: 48px;
            text-align: center;
            box-shadow: var(--glass-shadow);
          }

          .stepper {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 32px;
          }

          .step {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: var(--bg-accent);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            color: var(--text-muted);
          }

          .step.active {
            background: var(--unah-blue);
            color: white;
          }

          .step.approved {
            background: var(--status-approved);
            color: white;
          }

          .step-line {
            width: 40px;
            height: 2px;
            background: var(--border);
          }

          .step-line.approved {
            background: var(--status-approved);
          }

          h1 {
            font-family: var(--font-heading);
            font-size: 28px;
            color: var(--text-primary);
            margin-bottom: 12px;
          }

          p {
            color: var(--text-muted);
            margin-bottom: 40px;
          }

          .selection-content {
            display: flex;
            flex-direction: column;
            gap: 32px;
            margin-bottom: 40px;
          }

          .load-selector {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .edit-history-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid var(--border);
            border-radius: 12px;
            color: var(--text-primary);
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .edit-history-button:hover {
            background: var(--bg-accent);
            border-color: var(--unah-blue);
          }

          .logout-button {
            padding: 8px 16px;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .logout-button:hover {
            background: #dc2626;
            transform: translateY(-1px);
          }

          .load-btn {
            display: flex;
            flex-direction: column;
            padding: 20px;
            background: var(--surface);
            border: 2px solid var(--border);
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .load-btn.active {
            background: var(--status-approved-bg);
            border-color: var(--status-approved);
          }

          .load-btn .num {
            font-size: 24px;
            font-weight: 900;
            color: var(--unah-blue);
          }

          .load-btn .label {
            font-size: 11px;
            text-transform: uppercase;
            font-weight: 700;
            color: var(--text-muted);
          }

          .custom-load {
            grid-column: 1 / -1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-top: 8px;
          }

          .custom-input {
            width: 80px;
            padding: 8px;
            border: 2px solid var(--border);
            border-radius: 12px;
            text-align: center;
            font-weight: 800;
          }

          .summary-box {
            background: var(--bg-accent);
            padding: 20px;
            border-radius: 20px;
            display: flex;
            justify-content: space-around;
          }

          .summary-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .s-label {
            font-size: 11px;
            color: var(--text-muted);
            text-transform: uppercase;
            font-weight: 700;
          }

          .s-value {
            font-weight: 800;
            color: var(--unah-blue);
          }

          .finish-btn {
            width: 100%;
            padding: 16px;
            background: var(--status-approved);
            color: white;
            border: none;
            border-radius: 16px;
            font-weight: 800;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .finish-btn:hover {
            transform: scale(1.02);
            box-shadow: 0 8px 20px rgba(5, 150, 105, 0.3);
          }
        `}</style>
      </main>
    );
  }

  return (
    <>
      {/* SIDEBAR ACADÉMICO */}
      <aside className="academic-sidebar glass-panel">
        <div className="sidebar-section">
          <h3>Resumen Académico</h3>
          <div className="sidebar-metric">
            <span className="metric-label">Materias Aprobadas</span>
            <span className="metric-value approved">{approvedCount}</span>
          </div>
          <div className="sidebar-metric">
            <span className="metric-label">Materias en Curso</span>
            <span className="metric-value current">{currentCoursesCount}</span>
          </div>
          <div className="sidebar-metric">
            <span className="metric-label">Materias Pendientes</span>
            <span className="metric-value pending">{pendingCourses.length}</span>
          </div>
          <div className="sidebar-metric">
            <span className="metric-label">Total de Materias</span>
            <span className="metric-value">{totalCourses}</span>
          </div>
        </div>

        <div className="sidebar-section">
          <h3>Créditos Académicos</h3>
          <div className="sidebar-metric">
            <span className="metric-label">CA Aprobados</span>
            <span className="metric-value approved">{approvedCA}</span>
          </div>
          <div className="sidebar-metric">
            <span className="metric-label">CA en Curso</span>
            <span className="metric-value current">{currentCA}</span>
          </div>
          <div className="sidebar-metric">
            <span className="metric-label">Total CA</span>
            <span className="metric-value">{approvedCA + currentCA}</span>
          </div>
        </div>

        <div className="sidebar-section">
          <h3>Progreso General</h3>
          <div className="progress-percentage">
            <div className="percentage-value">{approvedPercentage}%</div>
            <div className="percentage-bar">
              <div className="percentage-fill" style={{ width: `${approvedPercentage}%` }}></div>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        <div className="page-actions glass-panel">
          <div>
            <p className="welcome-text">Sesión activa como <span>{currentUser}</span></p>
          </div>
          <div className="header-controls">
            <button className="edit-history-button" onClick={handleEditHistory}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Editar Historial
            </button>
            <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </div>
        {/* TARJETAS DE PROGRESO */}
        <section className="progress-overview">
          <h2>Estado Académico Actual</h2>
          <div className="progress-cards">
            <div className="progress-card approved">
              <div className="pc-value approved">{approvedCount}</div>
              <div className="pc-label">Aprobadas</div>
            </div>
            <div className="progress-card current">
              <div className="pc-value current">{currentCoursesCount}</div>
              <div className="pc-label">En Curso</div>
            </div>
            <div className="progress-card pending">
              <div className="pc-value pending">{pendingCourses.length}</div>
              <div className="pc-label">Pendientes</div>
            </div>
            <div className="progress-card total">
              <div className="pc-value total">{approvedPercentage}%</div>
              <div className="pc-label">Avance General</div>
            </div>
          </div>
        </section>

        {/* BARRA DE PROGRESO */}
        <section className="progress-bar-section">
          <div className="overall-bar">
            <div className="bar-labels">
              <span>Progreso Académico General</span>
              <span>{approvedCount + currentCoursesCount} / {totalCourses} materias · {approvedCA + currentCA} CA</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill-approved" style={{ width: `${approvedPercentage}%` }}></div>
              <div className="bar-fill-current" style={{ width: `${currentCoursesCount / totalCourses * 100}%` }}></div>
            </div>
          </div>
        </section>

        {/* ESTADÍSTICAS ACADÉMICAS DETALLADAS */}
        <section className="academic-stats-section">
          <AcademicStats
            approvedCourses={approvedCourses}
            totalCourses={totalCourses}
            approvedCount={approvedCount}
            approvedCA={approvedCA}
            currentCA={currentCA}
            years={years}
          />
        </section>

        {/* MOTOR DE RECOMENDACIÓN ACADÉMICA */}
        <section className="academic-planning">
          <RecommendationEngine
            approvedCourses={approvedCourses}
            currentCourses={dynamicCurrentCourses}
            suggestedPlan={suggestedPlan}
            years={years}
          />
        </section>

        {/* PLAN SUGERIDO DE COMPLETACIÓN */}
        {suggestedPlan.length > 0 && (
          <section className="suggested-plan-section glass-panel">
            <h2>
              <span style={{ fontSize: '1.2em' }}></span>
              Plan Sugerido para Completar la Carrera
            </h2>
            <p>Basado en llevar {coursesPerPeriod} clases por período, podrías completar tu carrera en <strong>{completionYear}</strong> durante el período <strong>{completionPeriod}</strong>.</p>
            <div className="suggested-plan-list">
              {suggestedPlan.map((period, index) => (
                <div key={index} className="suggested-period">
                  <h3>
                    {period.period.split(' ')[0]}
                    <span className="period-badge">{period.period.split(' ').slice(1).join(' ').replace(/[()]/g, '')}</span>
                  </h3>
                  <ul>
                    {period.courses.map(course => (
                      <li key={course.code}>
                        <span className="course-code-pill">{course.code}</span>
                        <span className="course-name-text">{course.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PLAN DE ESTUDIOS DETALLADO */}
        <section className="study-plan-detailed">
          <h2>Plan de Estudios por Años</h2>
          <div id="plan">
            {years.map((year, yi) => (
              <YearBlock
                key={year.year}
                year={year}
                approvedCourses={approvedCourses}
                currentCourses={dynamicCurrentCourses}
                onToggleApproved={toggleApproved}
                onToggleCurrent={toggleCurrent}
                animationDelay={yi * 0.08}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
