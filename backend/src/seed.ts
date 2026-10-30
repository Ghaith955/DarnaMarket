import 'dotenv/config';
import mongoose from 'mongoose';
import { User, Role } from './models/user.model';

/**
 * Crée les comptes de test dans MongoDB (mots de passe hashés par le hook pre('save')).
 * Usage (depuis /backend) :  npx tsx src/seed.ts
 * Nécessite le modèle User (src/models/user.model.ts) tel que fourni dans le guide.
 */
const users = [
  { name: 'Sana Khelifi', email: 'admin@darnamarket.tn', password: 'Admin@2026', role: Role.ADMIN, phone: '+216 71 123 456', city: 'Tunis', street: '5 Avenue Habib Bourguiba', isApproved: true, isBlocked: false },
  { name: 'Karim Ben Salah', email: 'karim.bensalah@darnamarket.tn', password: 'Karim@2026', role: Role.FOURNISSEUR, phone: '+216 98 214 365', city: 'Sfax', street: 'Route de Tunis km 4', isApproved: true, isBlocked: false },
  { name: 'Nour Gharbi', email: 'nour.gharbi@darnamarket.tn', password: 'Nour@2026', role: Role.FOURNISSEUR, phone: '+216 22 478 901', city: 'Sousse', street: '18 Rue de la Corniche', isApproved: true, isBlocked: false },
  { name: 'Sami Jlassi', email: 'sami.jlassi@darnamarket.tn', password: 'Sami@2026', role: Role.FOURNISSEUR, phone: '+216 55 332 187', city: 'Nabeul', street: 'Zone industrielle', isApproved: false, isBlocked: false },
  { name: 'Amina Trabelsi', email: 'amina.trabelsi@darnamarket.tn', password: 'Amina@2026', role: Role.CLIENT, phone: '+216 97 560 432', city: 'Tunis', street: '12 Rue de Marseille', isApproved: true, isBlocked: false },
  { name: 'Youssef Mejri', email: 'youssef.mejri@darnamarket.tn', password: 'Youssef@2026', role: Role.CLIENT, phone: '+216 20 884 719', city: 'Bizerte', street: '7 Rue Ibn Khaldoun', isApproved: true, isBlocked: false },
  { name: 'Rim Hammami', email: 'rim.hammami@darnamarket.tn', password: 'Rim@2026', role: Role.CLIENT, phone: '+216 53 906 278', city: 'Monastir', street: '3 Avenue de la République', isApproved: true, isBlocked: true },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI!);
  for (const { city, street, ...u } of users) {
    await User.deleteOne({ email: u.email });
    await User.create({ ...u, address: { street, city, zip: '1000', country: 'Tunisie' } }); // create() déclenche le hash du mot de passe
    console.log('✔', u.role.padEnd(11), u.email);
  }
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
