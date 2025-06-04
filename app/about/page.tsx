'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';

const teamMembers = [
  {
    name: 'Sadinal Mufti',
    role: 'Full Stack Developer',
    description: 'Mahasiswa Informatika yang berfokus pada pengembangan aplikasi web dan mobile.',
    image: '/images/team/dinal.jpeg'
  },
  {
    name: 'M. Habil Aswad',
    role: 'Full Stack Developer',
    description: 'Mahasiswa Informatika dengan passion dalam desain antarmuka dan pengalaman pengguna.',
    image: '/images/team/habil.jpeg'
  },
  {
    name: 'Aulia Vika Rahman',
    role: 'Full Stack Developerr',
    description: 'Mahasiswa Informatika yang mendalami pengembangan backend dan arsitektur sistem.',
    image: '/images/team/aulia.jpeg'
  }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F6F6F6] pt-20">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[400px] bg-[var(--color-1)] overflow-hidden">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Kami adalah tim yang berkomitmen untuk memberikan pengalaman terbaik dalam reservasi meja cafe
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[var(--color-2)] mb-4">Our Mission</h2>
            <p className="text-[var(--color-3)] max-w-2xl mx-auto">
              Menyediakan sistem reservasi meja cafe yang mudah dan efisien untuk meningkatkan pengalaman pelanggan dan membantu pengelolaan cafe menjadi lebih baik.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[var(--color-2)] mb-12">Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-[#F6F6F6] rounded-xl p-6 text-center transform transition duration-300 hover:-translate-y-2"
              >
                <div className="w-48 h-48 mx-auto mb-6 relative rounded-full overflow-hidden border-4 border-[var(--color-1)] shadow-lg ring-4 ring-[var(--color-2)] ring-opacity-20">
                  <Image
                    src={member.image}
                    alt={member.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-2)] mb-2">{member.name}</h3>
                <p className="text-[var(--color-1)] font-medium mb-3">{member.role}</p>
                <p className="text-[var(--color-3)]">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[var(--color-2)] mb-12">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[var(--color-1)] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--color-2)] mb-2">Efisiensi</h3>
              <p className="text-[var(--color-3)]">Mengoptimalkan proses reservasi untuk menghemat waktu dan tenaga</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[var(--color-1)] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--color-2)] mb-2">Kemudahan</h3>
              <p className="text-[var(--color-3)]">Interface yang user-friendly untuk semua pengguna</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[var(--color-1)] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--color-2)] mb-2">Keamanan</h3>
              <p className="text-[var(--color-3)]">Menjaga keamanan data dan transaksi pengguna</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 