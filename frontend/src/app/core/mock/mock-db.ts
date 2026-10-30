import { Category, L10n, Order, Product, User } from '../models';

export interface Db { users: User[]; categories: Category[]; products: Product[]; orders: Order[]; }

const l = (fr: string, en: string, ar: string): L10n => ({ fr, en, ar });
const imgs = (s: string) => [1, 2, 3].map(i => `https://picsum.photos/seed/darna-${s}-${i}/800/600`);

/** Comptes de démonstration (fictifs) — affichés sur la page de connexion. */
export const DEMO_ACCOUNTS = [
  { role: 'ADMIN', name: 'Sana Khelifi', email: 'admin@darnamarket.tn', password: 'Admin@2026' },
  { role: 'FOURNISSEUR', name: 'Karim Ben Salah', email: 'karim.bensalah@darnamarket.tn', password: 'Karim@2026' },
  { role: 'FOURNISSEUR', name: 'Nour Gharbi', email: 'nour.gharbi@darnamarket.tn', password: 'Nour@2026' },
  { role: 'CLIENT', name: 'Amina Trabelsi', email: 'amina.trabelsi@darnamarket.tn', password: 'Amina@2026' },
  { role: 'CLIENT', name: 'Youssef Mejri', email: 'youssef.mejri@darnamarket.tn', password: 'Youssef@2026' },
] as const;

export function seedDb(): Db {
  const users: User[] = [
    { _id: 'u_admin', name: 'Sana Khelifi', email: 'admin@darnamarket.tn', password: 'Admin@2026', role: 'ADMIN', phone: '+216 71 123 456', address: '5 Avenue Habib Bourguiba', city: 'Tunis', isBlocked: false, isApproved: true, createdAt: '2026-01-05T09:00:00Z' },
    { _id: 'u_v1', name: 'Karim Ben Salah', email: 'karim.bensalah@darnamarket.tn', password: 'Karim@2026', role: 'FOURNISSEUR', phone: '+216 98 214 365', address: 'Route de Tunis km 4', city: 'Sfax', isBlocked: false, isApproved: true, createdAt: '2026-01-12T10:00:00Z' },
    { _id: 'u_v2', name: 'Nour Gharbi', email: 'nour.gharbi@darnamarket.tn', password: 'Nour@2026', role: 'FOURNISSEUR', phone: '+216 22 478 901', address: '18 Rue de la Corniche', city: 'Sousse', isBlocked: false, isApproved: true, createdAt: '2026-01-20T10:00:00Z' },
    { _id: 'u_v3', name: 'Sami Jlassi', email: 'sami.jlassi@darnamarket.tn', password: 'Sami@2026', role: 'FOURNISSEUR', phone: '+216 55 332 187', address: 'Zone industrielle', city: 'Nabeul', isBlocked: false, isApproved: false, createdAt: '2026-10-25T10:00:00Z' },
    { _id: 'u_c1', name: 'Amina Trabelsi', email: 'amina.trabelsi@darnamarket.tn', password: 'Amina@2026', role: 'CLIENT', phone: '+216 97 560 432', address: '12 Rue de Marseille', city: 'Tunis', isBlocked: false, isApproved: true, createdAt: '2026-02-03T14:00:00Z' },
    { _id: 'u_c2', name: 'Youssef Mejri', email: 'youssef.mejri@darnamarket.tn', password: 'Youssef@2026', role: 'CLIENT', phone: '+216 20 884 719', address: '7 Rue Ibn Khaldoun', city: 'Bizerte', isBlocked: false, isApproved: true, createdAt: '2026-03-15T16:30:00Z' },
    { _id: 'u_c3', name: 'Rim Hammami', email: 'rim.hammami@darnamarket.tn', password: 'Rim@2026', role: 'CLIENT', phone: '+216 53 906 278', address: '3 Avenue de la République', city: 'Monastir', isBlocked: true, isApproved: true, createdAt: '2026-04-02T11:00:00Z' },
  ];

  const categories: Category[] = [
    { _id: 'c_salon', slug: 'salon', name: l('Salon & Canapés', 'Living Room & Sofas', 'الصالون والأرائك'), parent: null },
    { _id: 'c_canapes', slug: 'canapes', name: l('Canapés', 'Sofas', 'أرائك'), parent: 'c_salon' },
    { _id: 'c_tables-basses', slug: 'tables-basses', name: l('Tables basses', 'Coffee tables', 'طاولات القهوة'), parent: 'c_salon' },
    { _id: 'c_chambre', slug: 'chambre', name: l('Chambre à coucher', 'Bedroom', 'غرفة النوم'), parent: null },
    { _id: 'c_lits', slug: 'lits', name: l('Lits', 'Beds', 'أسرّة'), parent: 'c_chambre' },
    { _id: 'c_armoires', slug: 'armoires', name: l('Armoires', 'Wardrobes', 'خزائن'), parent: 'c_chambre' },
    { _id: 'c_cuisine', slug: 'cuisine', name: l('Cuisine & Salle à manger', 'Kitchen & Dining', 'المطبخ وغرفة الطعام'), parent: null },
    { _id: 'c_tables-manger', slug: 'tables-manger', name: l('Tables à manger', 'Dining tables', 'طاولات الطعام'), parent: 'c_cuisine' },
    { _id: 'c_chaises', slug: 'chaises', name: l('Chaises', 'Chairs', 'كراسي'), parent: 'c_cuisine' },
    { _id: 'c_decoration', slug: 'decoration', name: l('Décoration', 'Decoration', 'الديكور'), parent: null },
    { _id: 'c_luminaires', slug: 'luminaires', name: l('Luminaires', 'Lighting', 'الإضاءة'), parent: 'c_decoration' },
    { _id: 'c_tapis', slug: 'tapis', name: l('Tapis', 'Rugs', 'سجاد'), parent: 'c_decoration' },
    { _id: 'c_miroirs', slug: 'miroirs', name: l('Miroirs', 'Mirrors', 'مرايا'), parent: 'c_decoration' },
    { _id: 'c_equipement', slug: 'equipement', name: l('Équipement intérieur', 'Home equipment', 'تجهيزات المنزل'), parent: null },
    { _id: 'c_rangement', slug: 'rangement', name: l('Rangement', 'Storage', 'تخزين'), parent: 'c_equipement' },
  ];

  const mk = (id: string, seed: string, title: L10n, description: L10n, price: number, brand: string,
    category: string, vendor: string, stock: number, status: Product['status'] = 'APPROVED',
    extra: Partial<Product> = {}): Product =>
    ({ _id: id, title, description, price, brand, images: imgs(seed), stock, category, vendor, status, reviews: [], createdAt: '2026-06-01T10:00:00Z', ...extra });

  const products: Product[] = [
    mk('p1', 'canape-milano', l("Canapé d'angle Milano 5 places", 'Milano 5-seat corner sofa', 'أريكة ميلانو زاوية 5 مقاعد'),
      l("Canapé d'angle spacieux en tissu déperlant, structure en bois massif, coussins déhoussables.", 'Spacious corner sofa in water-repellent fabric, solid wood frame, removable covers.', 'أريكة زاوية واسعة بقماش مقاوم للماء، هيكل من الخشب الصلب، وسائد قابلة للفك.'),
      1890, 'Confort+', 'c_canapes', 'u_v1', 8, 'APPROVED', { reviews: [
        { userId: 'u_c1', userName: 'Amina Trabelsi', rating: 5, comment: 'Très confortable, livraison soignée.', createdAt: '2026-08-10T12:00:00Z' },
        { userId: 'u_c2', userName: 'Youssef Mejri', rating: 4, comment: 'Beau canapé, montage facile.', createdAt: '2026-09-02T18:00:00Z' }] }),
    mk('p2', 'canape-oslo', l('Canapé 3 places Oslo en velours', 'Oslo 3-seat velvet sofa', 'أريكة أوسلو مخمل 3 مقاعد'),
      l('Style scandinave, velours doux, pieds en métal doré.', 'Scandinavian style, soft velvet, gold metal legs.', 'تصميم اسكندنافي، مخمل ناعم، أرجل معدنية ذهبية.'),
      1250, 'Nordika', 'c_canapes', 'u_v1', 12),
    mk('p3', 'table-atlas', l('Table basse en chêne Atlas', 'Atlas oak coffee table', 'طاولة قهوة أطلس من خشب البلوط'),
      l('Plateau en chêne massif et rangement latéral.', 'Solid oak top with side storage.', 'سطح من خشب البلوط الصلب مع تخزين جانبي.'),
      340, 'Atlas Bois', 'c_tables-basses', 'u_v1', 20, 'APPROVED', { reviews: [
        { userId: 'u_c1', userName: 'Amina Trabelsi', rating: 5, comment: 'Finition magnifique.', createdAt: '2026-08-15T09:00:00Z' }] }),
    mk('p4', 'lit-sahara', l('Lit double 160x200 Sahara avec rangement', 'Sahara double bed 160x200 with storage', 'سرير مزدوج صحراء 160x200 مع تخزين'),
      l('Tête de lit capitonnée et coffre de rangement sous le sommier.', 'Padded headboard and under-bed storage chest.', 'ظهر سرير مبطن وصندوق تخزين تحت السرير.'),
      1450, 'Sahara', 'c_lits', 'u_v1', 5),
    mk('p5', 'armoire-sahara', l('Armoire 3 portes coulissantes', '3-door sliding wardrobe', 'خزانة 3 أبواب منزلقة'),
      l('Portes coulissantes avec miroir, penderie et étagères intérieures.', 'Sliding mirror doors, hanging rail and inner shelves.', 'أبواب منزلقة بمرآة، علاقة وأرفف داخلية.'),
      1680, 'Sahara', 'c_armoires', 'u_v1', 3),
    mk('p6', 'table-carthage', l('Table à manger extensible Carthage', 'Carthage extendable dining table', 'طاولة طعام قرطاج قابلة للتمديد'),
      l('De 6 à 10 couverts grâce à ses rallonges intégrées.', 'Seats 6 to 10 with built-in extensions.', 'تتسع من 6 إلى 10 أشخاص بفضل الامتدادات المدمجة.'),
      980, 'Atlas Bois', 'c_tables-manger', 'u_v1', 6),
    mk('p7', 'chaises-nordik', l('Lot de 4 chaises scandinaves', 'Set of 4 Scandinavian chairs', 'طقم 4 كراسي اسكندنافية'),
      l('Assise rembourrée, pieds en hêtre.', 'Padded seat, beech legs.', 'مقعد مبطن، أرجل من خشب الزان.'),
      420, 'Nordika', 'c_chaises', 'u_v1', 15),
    mk('p8', 'lampadaire', l('Lampadaire arc doré', 'Golden arc floor lamp', 'مصباح أرضي مقوّس ذهبي'),
      l('Pied en marbre, abat-jour en lin, hauteur 2 m.', 'Marble base, linen shade, 2 m tall.', 'قاعدة رخامية، غطاء من الكتان، ارتفاع 2 م.'),
      210, 'LumiDar', 'c_luminaires', 'u_v2', 25),
    mk('p9', 'tapis-kairouan', l('Tapis berbère Kairouan 200x300', 'Kairouan Berber rug 200x300', 'سجادة القيروان البربرية 200x300'),
      l('Tissé à la main en laine naturelle, motifs traditionnels.', 'Hand-woven in natural wool, traditional patterns.', 'منسوجة يدويًا من الصوف الطبيعي بنقوش تقليدية.'),
      560, 'Tapis Kairouan', 'c_tapis', 'u_v2', 9),
    mk('p10', 'miroir-rotin', l('Miroir rond cadre rotin 80 cm', 'Round rattan-frame mirror 80 cm', 'مرآة دائرية بإطار من الروطان 80 سم'),
      l('Cadre en rotin tressé à la main.', 'Hand-braided rattan frame.', 'إطار من الروطان المجدول يدويًا.'),
      145, 'Sahel Déco', 'c_miroirs', 'u_v2', 30),
    mk('p11', 'etagere', l('Étagère murale modulable', 'Modular wall shelf', 'رف حائط قابل للتعديل'),
      l('Modules en bois à assembler selon vos besoins.', 'Wooden modules to assemble as needed.', 'وحدات خشبية للتركيب حسب الحاجة.'),
      190, 'Sahel Déco', 'c_rangement', 'u_v2', 14, 'PENDING'),
    mk('p12', 'vase-nabeul', l('Vase en céramique de Nabeul', 'Nabeul ceramic vase', 'مزهرية خزف نابل'),
      l('Pièce artisanale peinte à la main.', 'Hand-painted artisan piece.', 'قطعة حرفية مرسومة يدويًا.'),
      65, 'Nabeul Art', 'c_decoration', 'u_v2', 10, 'REJECTED', { rejectionReason: 'Photos de qualité insuffisante' }),
  ];

  const ship = (u: User) => ({ fullName: u.name, phone: u.phone ?? '', street: u.address ?? '', city: u.city ?? '', zip: '1000' });
  const item = (p: Product, q: number) => ({ productId: p._id, vendorId: p.vendor, title: p.title, price: p.price, image: p.images[0], quantity: q });
  const P = (id: string) => products.find(p => p._id === id)!;
  const U = (id: string) => users.find(u => u._id === id)!;

  const orders: Order[] = [
    { _id: 'o_1001', customerId: 'u_c1', items: [item(P('p3'), 1), item(P('p7'), 1)], shipping: ship(U('u_c1')), paymentMethod: 'CASH_ON_DELIVERY', total: 760, status: 'DELIVERED', createdAt: '2026-08-05T10:00:00Z' },
    { _id: 'o_1002', customerId: 'u_c1', items: [item(P('p8'), 1), item(P('p10'), 2)], shipping: ship(U('u_c1')), paymentMethod: 'CARD', total: 500, status: 'PENDING', createdAt: '2026-10-27T15:20:00Z' },
    { _id: 'o_1003', customerId: 'u_c2', items: [item(P('p4'), 1)], shipping: ship(U('u_c2')), paymentMethod: 'CASH_ON_DELIVERY', total: 1450, status: 'SHIPPED', createdAt: '2026-10-20T09:40:00Z' },
    { _id: 'o_1004', customerId: 'u_c2', items: [item(P('p1'), 1)], shipping: ship(U('u_c2')), paymentMethod: 'CARD', total: 1890, status: 'DELIVERED', createdAt: '2026-08-28T13:00:00Z' },
  ];

  return { users, categories, products, orders };
}
