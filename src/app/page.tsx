import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Sistema de Formularios Médicos
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Formulario de Valoración Facial para uso estético
        </p>
        <Link 
          href="/facial-assessment"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Acceder al Formulario
        </Link>
      </div>
    </div>
  );
}
