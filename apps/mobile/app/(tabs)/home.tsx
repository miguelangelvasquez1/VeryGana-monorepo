import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Megaphone,
  Gamepad2,
  Gift,
  ShoppingBag,
  TrendingUp,
  Zap,
  Trophy,
  Sparkles,
  ChevronRight,
  Leaf,
  Heart,
  Users,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const user   = { name: 'Miguel' };
  const stats  = { adsWatched: 47, gamesPlayed: 12, raffleTickets: 8 };

  const quickActions = [
    { id: 'ads',      title: 'Ver Anuncios', subtitle: 'Gana puntos',  icon: Megaphone,  gradient: ['#EC4899', '#F43F5E'] as const, route: '/(tabs)/ads'      },
    { id: 'games',    title: 'Jugar',        subtitle: 'Diviértete',   icon: Gamepad2,   gradient: ['#8B5CF6', '#A78BFA'] as const, route: '/(tabs)/games'    },
    { id: 'raffles',  title: 'Rifas',        subtitle: 'Participa',    icon: Gift,       gradient: ['#F59E0B', '#FBBF24'] as const, route: '/(tabs)/raffles'  },
    { id: 'products', title: 'Tienda',       subtitle: 'Canjea',       icon: ShoppingBag,gradient: ['#10B981', '#34D399'] as const, route: '/(tabs)/products' },
  ];

  const featured = [
    { id: 1, type: 'ad',      title: '¡Nuevos anuncios disponibles!',   description: 'Gana hasta 50 puntos por cada anuncio que veas',  icon: Zap,      color: '#EC4899', bgColor: '#FDF2F8', action: () => router.push('/(tabs)/ads')      },
    { id: 2, type: 'raffle',  title: 'Rifa Especial: iPhone 15 Pro',    description: 'Solo quedan 45 boletos. ¡No te lo pierdas!',       icon: Trophy,   color: '#F59E0B', bgColor: '#FFFBEB', action: () => router.push('/(tabs)/raffles')  },
    { id: 3, type: 'product', title: 'Nuevos productos en tienda',      description: 'Audífonos, tarjetas de regalo y mucho más',        icon: Sparkles, color: '#10B981', bgColor: '#ECFDF5', action: () => router.push('/(tabs)/products') },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Welcome ── */}
      <View style={styles.welcomeSection}>
        <Text style={styles.greeting}>¡Hola, {user.name}! 👋</Text>
        <Text style={styles.subtitle}>¿Qué quieres hacer hoy?</Text>
      </View>

      {/* ── Stats ── */}
      <View style={styles.statsContainer}>
        <StatCard label="Anuncios vistos"  value={stats.adsWatched}    icon={TrendingUp} color="#EC4899" />
        <StatCard label="Juegos jugados"   value={stats.gamesPlayed}   icon={Gamepad2}   color="#8B5CF6" />
        <StatCard label="Boletos activos"  value={stats.raffleTickets} icon={Gift}       color="#F59E0B" />
      </View>

      {/* ── Quick actions ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Acciones rápidas</Text>
      </View>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action) => (
          <QuickActionCard key={action.id} action={action} />
        ))}
      </View>

      {/* ════════════════════════════════════════════════
          IMPACT STORIES BANNER
          ════════════════════════════════════════════════ */}
      <ImpactStoriesBanner />

      {/* ── Featured ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Destacados</Text>
        <Text style={styles.sectionSubtitle}>No te pierdas estas oportunidades</Text>
      </View>
      {featured.map((item) => (
        <FeaturedCard key={item.id} item={item} />
      ))}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

// ─── ImpactStoriesBanner ──────────────────────────────────────────────────────

function ImpactStoriesBanner() {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => router.push('/forum')}
      style={styles.bannerWrapper}
    >
      <LinearGradient
        colors={['#064E3B', '#065F46', '#059669']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bannerGradient}
      >
        {/* Decorative circles */}
        <View style={styles.bannerCircle1} />
        <View style={styles.bannerCircle2} />

        {/* Left: text */}
        <View style={styles.bannerLeft}>
          <View style={styles.bannerBadge}>
            <Leaf color="#34D399" size={12} />
            <Text style={styles.bannerBadgeText}>Foro de Impacto</Text>
          </View>

          <Text style={styles.bannerTitle}>
            Conoce el impacto{'\n'}de tu participación
          </Text>
          <Text style={styles.bannerBody}>
            Historias reales de las comunidades que hemos apoyado juntos.
          </Text>

          <View style={styles.bannerCta}>
            <Text style={styles.bannerCtaText}>Ver historias</Text>
            <ChevronRight color="#34D399" size={16} />
          </View>
        </View>

        {/* Right: stats pills */}
        <View style={styles.bannerRight}>
          <BannerStat icon={<Heart color="#F472B6" size={14} fill="#F472B6"/>} value="120+" label="historias" />
          <BannerStat icon={<Users color="#60A5FA" size={14} />}              value="4,800+" label="beneficiados" />
          <BannerStat icon={<Sparkles color="#FCD34D" size={14} />}           value="15"     label="categorías" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function BannerStat({
  icon, value, label,
}: {
  icon: React.ReactNode; value: string; label: string;
}) {
  return (
    <View style={styles.bannerStat}>
      {icon}
      <Text style={styles.bannerStatValue}>{value}</Text>
      <Text style={styles.bannerStatLabel}>{label}</Text>
    </View>
  );
}

// ─── Existing sub-components ──────────────────────────────────────────────────

function StatCard({
  label, value, icon: Icon, color,
}: {
  label: string; value: number; icon: any; color: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: `${color}15` }]}>
        <Icon color={color} size={18} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function QuickActionCard({ action }: { action: any }) {
  const Icon = action.icon;
  return (
    <TouchableOpacity
      style={styles.quickActionCard}
      onPress={() => router.push(action.route)}
      activeOpacity={0.7}
    >
      <LinearGradient colors={action.gradient} style={styles.quickActionGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.quickActionIconContainer}>
          <Icon color="#FFFFFF" size={28} />
        </View>
        <Text style={styles.quickActionTitle}>{action.title}</Text>
        <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function FeaturedCard({ item }: { item: any }) {
  const Icon = item.icon;
  return (
    <TouchableOpacity
      style={[styles.featuredCard, { backgroundColor: item.bgColor }]}
      onPress={item.action}
      activeOpacity={0.8}
    >
      <View style={styles.featuredContent}>
        <View style={[styles.featuredIconContainer, { backgroundColor: item.color }]}>
          <Icon color="#FFFFFF" size={20} />
        </View>
        <View style={styles.featuredTextContainer}>
          <Text style={styles.featuredTitle}>{item.title}</Text>
          <Text style={styles.featuredDescription}>{item.description}</Text>
        </View>
      </View>
      <ChevronRight color={item.color} size={20} />
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#F9FAFB' },
  content:     { padding: 20, paddingTop: 12 },

  welcomeSection: { marginBottom: 24 },
  greeting:       { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 4 },
  subtitle:       { fontSize: 16, color: '#6B7280', fontWeight: '500' },

  statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  statIconContainer: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statValue:         { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 2 },
  statLabel:         { fontSize: 11, color: '#6B7280', fontWeight: '600', textAlign: 'center' },

  sectionHeader:   { marginBottom: 16 },
  sectionTitle:    { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, color: '#6B7280', fontWeight: '500' },

  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 },
  quickActionCard: {
    width: (width - 52) / 2,
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 },
      android: { elevation: 4 },
    }),
  },
  quickActionGradient:      { flex: 1, padding: 16, justifyContent: 'space-between' },
  quickActionIconContainer: { width: 52, height: 52, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' },
  quickActionTitle:         { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginTop: 8 },
  quickActionSubtitle:      { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },

  // ── Banner ──────────────────────────────────────────────────────────────────
  bannerWrapper: {
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 32,
    ...Platform.select({
      ios:     { shadowColor: '#065F46', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 16 },
      android: { elevation: 6 },
    }),
  },
  bannerGradient: {
    flexDirection: 'row',
    padding: 20,
    paddingVertical: 22,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerCircle1: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -40,
    right: 60,
  },
  bannerCircle2: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.07)',
    bottom: -20,
    right: -10,
  },
  bannerLeft: { flex: 1, paddingRight: 12 },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  bannerBadgeText: { color: '#34D399', fontSize: 11, fontWeight: '700' },
  bannerTitle:     { fontSize: 18, fontWeight: '800', color: '#fff', lineHeight: 24, marginBottom: 6 },
  bannerBody:      { fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 18, marginBottom: 14, fontWeight: '500' },
  bannerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  bannerCtaText: { color: '#34D399', fontSize: 13, fontWeight: '700' },
  bannerRight: { justifyContent: 'center', gap: 10, minWidth: 80 },
  bannerStat: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 2,
  },
  bannerStatValue: { color: '#fff', fontSize: 14, fontWeight: '800' },
  bannerStatLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: '600' },

  // ── Featured ────────────────────────────────────────────────────────────────
  featuredCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  featuredContent:       { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  featuredIconContainer: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  featuredTextContainer: { flex: 1 },
  featuredTitle:         { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 2 },
  featuredDescription:   { fontSize: 13, color: '#6B7280', fontWeight: '500', lineHeight: 18 },
});