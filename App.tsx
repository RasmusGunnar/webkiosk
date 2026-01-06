import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type TabKey = 'home' | 'communities' | 'factions' | 'matchday' | 'inbox' | 'profile';

const accent = '#c8102e'; // FCN-inspired red
const accentDark = '#7c0f26';
const amber = '#f2c94c';
const muted = '#e8ecf0';
const soft = '#f7f2ef';
const textPrimary = '#0c1a2b';
const textSecondary = '#3d4a5c';

const heroArt =
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1400&q=80&sat=-20&blend=111827&sat=-25';
const clubLogo =
  'https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/FC_Nordsj%C3%A6lland_logo.svg/1200px-FC_Nordsj%C3%A6lland_logo.svg.png';
const awayLogo =
  'https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Br%C3%B8ndby_IF_logo.svg/1200px-Br%C3%B8ndby_IF_logo.svg.png';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'home', label: 'Hjem' },
  { key: 'communities', label: 'Byfællesskaber' },
  { key: 'factions', label: 'Fraktioner' },
  { key: 'matchday', label: 'Kampdag' },
  { key: 'inbox', label: 'Indbakke' },
  { key: 'profile', label: 'Profil' },
];

const match = {
  opponent: 'Brøndby IF',
  datetime: 'Lør 2. nov · 16:00',
  venue: 'Right to Dream Park',
  focus: ['Superliga', 'Hjemmebane'],
};

const communities = [
  {
    name: 'Ganløse',
    members: 128,
    heading: '13 tager afsted til næste kamp',
    highlights: ['Samling på torvet 13:30', '2 lift ledige'],
    image:
      'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Farum',
    members: 342,
    heading: 'Fælles afgang fra stationen 14:45',
    highlights: ['“Kom alene”-venligt', '3 events i dag'],
    image:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Hillerød',
    members: 210,
    heading: 'Udebanetur til Aarhus planlægges',
    highlights: ['2 samkørsler åbne', 'Afstemning om fanmarch'],
    image:
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80',
  },
];

const factions = [
  {
    name: 'Wild Tigers',
    members: 512,
    motto: 'Sektion C · Høj energi · Tifo & chants',
    channels: ['#kampdag', '#sange', '#tifo'],
    setlist: ['FCN – Vi er her igen', 'Nord som aldrig før', 'Alle mand på dæk'],
    image:
      'https://images.unsplash.com/photo-1522778119026-939cd0d94eab?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Mild Fathers',
    members: 94,
    motto: 'Familietribunen · Rolig stemning · Hyggelige ture',
    channels: ['#kampdag', '#planlægning', '#familie'],
    setlist: ['For Farum og for familien', 'Vi står sammen', 'Klapsang til pausen'],
    image:
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80',
  },
];

const events = {
  ganlose: [
    {
      title: 'Samling i Ganløse før kamp',
      time: '13:30 · Ganløse Torv',
      tags: ['Lokalt', 'Velkommen alene'],
      attendees: 18,
    },
    {
      title: 'Fælles afgang med bil',
      time: '14:15 · 3 pladser',
      tags: ['Samkørsel'],
      attendees: 6,
    },
    {
      title: 'Efterkamp på Farum Kro',
      time: '18:30 · “Vi fejrer sejren”',
      tags: ['Efterkamp'],
      attendees: 12,
    },
  ],
  matchday: [
    {
      title: 'Indgang 1 · Fanrute',
      time: '15:20 · March fra stationen',
      tags: ['Stadion', 'Offentlig'],
      attendees: 44,
    },
    {
      title: 'Wild Tigers · Tifo brief',
      time: '14:45 · Sektion C indgang',
      tags: ['Fraktion', 'Read-only info'],
      attendees: 60,
    },
  ],
};

const inbox = [
  { title: 'Ny fraktion opdatering', detail: 'Wild Tigers har pin’et setlisten for Brøndby-kampen.' },
  { title: 'Lift tilbudt fra Ganløse', detail: 'Jacob: 2 pladser, afgang 14:10.' },
  { title: 'Nyt event', detail: 'Efterkamp på Farum Kro er oprettet.' },
  { title: 'Notifikationer', detail: 'Du har nye beskeder i #kampdag (Wild Tigers).' },
];

const gallery = [
  {
    title: 'Sektion C i rødt',
    caption: 'Tifo klar – flag og røg til opvarmningen',
    image:
      'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=80&sat=-15',
  },
  {
    title: 'Familietribunen hygger',
    caption: 'Kakao, ansigtsmaling og autografer til de yngste',
    image:
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Fanrute fra stationen',
    caption: 'Røde halstørklæder hele vejen til Right to Dream',
    image:
      'https://images.unsplash.com/photo-1434648957308-5e6a859697e8?auto=format&fit=crop&w=1200&q=80',
  },
];

const songs = [
  {
    title: 'FCN – Vi er her igen',
    tags: ['Tempo: høj', 'Sektion C'],
    body: 'Vi er FC Nordsjælland, vi står sammen skulder ved skulder ...',
  },
  {
    title: 'For Farum og for familien',
    tags: ['Rolig', 'Familietribunen'],
    body: 'For Farum, for fællesskabet, vi synger højt for vores hold ...',
  },
];

const featureFlags = {
  songbookEnabled: true,
  factionsPublic: true,
  readOnlyChannels: true,
  remoteConfigDoc: 'config/app',
};

const Pill = ({ label }: { label: string }) => (
  <View style={styles.pill}>
    <Text style={styles.pillText}>{label}</Text>
  </View>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.divider} />
    </View>
    {children}
  </View>
);

const Card = ({
  title,
  subtitle,
  meta,
  children,
  highlight,
  image,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  highlight?: string;
  image?: string;
  children?: React.ReactNode;
}) => (
  <View style={styles.card}>
    {image ? (
      <ImageBackground source={{ uri: image }} style={styles.cardImage} imageStyle={styles.cardImageRadius}>
        <View style={styles.cardImageOverlay}>
          <Text style={styles.cardImageLabel}>Stemningsbillede</Text>
        </View>
      </ImageBackground>
    ) : null}
    <View style={styles.cardHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
        {meta ? <Text style={styles.cardMeta}>{meta}</Text> : null}
      </View>
      {highlight ? <Text style={styles.cardBadge}>{highlight}</Text> : null}
    </View>
    {children}
  </View>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <Section title="Næste kamp">
              <Card title={`FCN vs ${match.opponent}`} subtitle={match.datetime} meta={match.venue}>
                <View style={styles.rowGap}>
                  <View style={styles.crestRow}>
                    <View style={styles.crestBox}>
                      <Image source={{ uri: clubLogo }} style={styles.crest} resizeMode="contain" />
                      <Text style={styles.cardSubtitle}>FC Nordsjælland</Text>
                    </View>
                    <Text style={styles.vs}>vs</Text>
                    <View style={styles.crestBox}>
                      <Image source={{ uri: awayLogo }} style={styles.crest} resizeMode="contain" />
                      <Text style={styles.cardSubtitle}>{match.opponent}</Text>
                    </View>
                  </View>
                  <View style={styles.pillRow}>
                    {match.focus.map((item) => (
                      <Pill key={item} label={item} />
                    ))}
                  </View>
                  <Text style={styles.caption}>Tryk “Se kampdag” i appen for events og fanruter.</Text>
                </View>
              </Card>
            </Section>
            <Section title="Mit fællesskab">
              <Card
                title="Ganløse"
                subtitle="Byfællesskab · Offentlig"
                meta="13 tager afsted · 2 samkørsler"
                highlight="Fokus"
              >
                <View style={styles.rowGap}>
                  <View style={styles.pillRow}>
                    <Pill label="“Kom alene”-venligt" />
                    <Pill label="Events i dag: 3" />
                  </View>
                  <Text style={styles.caption}>
                    Brug “Jeg tager afsted” for at tælle op og foreslå samkørsel.
                  </Text>
                </View>
              </Card>
            </Section>
            <Section title="Mine aktive ting">
              <View style={styles.stack}>
                <Card title="Indgang 1 · Fanrute" subtitle="15:20 · March fra stationen" meta="44 kommer" />
                <Card title="Efterkamp på Farum Kro" subtitle="18:30" meta="12 kommer" />
                <Card title="Wild Tigers #kampdag" subtitle="Nye beskeder" meta="Setliste opdateret" />
              </View>
            </Section>
          </>
        );
      case 'communities':
        return (
          <>
            <Section title="Byfællesskaber (offentlige)">
              {communities.map((community) => (
                <Card
                  key={community.name}
                  title={community.name}
                  subtitle={`${community.members} medlemmer`}
                  meta={community.heading}
                  highlight="Åbent"
                  image={community.image}
                >
                  <View style={styles.pillRow}>
                    {community.highlights.map((item) => (
                      <Pill key={item} label={item} />
                    ))}
                  </View>
                </Card>
              ))}
            </Section>
            <Section title="Opret nyt fællesskab">
              <Card
                title="By / Område"
                subtitle="Undgå dubletter · fx “Ganløse (Egedal)”"
                meta="Offentlig visning · login kræves for at skrive"
              >
                <View style={styles.pillRow}>
                  <Pill label="Captain + co-captain" />
                  <Pill label="Rapportér/Skjul" />
                  <Pill label="Pinned regler" />
                </View>
              </Card>
            </Section>
          </>
        );
      case 'factions':
        return (
          <>
            <Section title="Fanfraktioner (offentlige)">
              {factions.map((faction) => (
                <Card
                  key={faction.name}
                  title={faction.name}
                  subtitle={`${faction.members} medlemmer`}
                  meta={faction.motto}
                  highlight="Alle kan se"
                  image={faction.image}
                >
                  <View style={styles.rowGap}>
                    <View style={styles.pillRow}>
                      {faction.channels.map((channel) => (
                        <Pill key={channel} label={channel} />
                      ))}
                    </View>
                    <Text style={styles.caption}>Sangbog & setlist til kampdag:</Text>
                    <View style={styles.pillRow}>
                      {faction.setlist.map((song) => (
                        <Pill key={song} label={song} />
                      ))}
                    </View>
                  </View>
                </Card>
              ))}
            </Section>
            <Section title="Sangbog (offentlig visning)">
              {songs.map((song) => (
                <Card key={song.title} title={song.title} subtitle={song.tags.join(' · ')}>
                  <Text style={styles.caption}>{song.body}</Text>
                </Card>
              ))}
            </Section>
          </>
        );
      case 'matchday':
        return (
          <>
            <Section title="Filter: Mit fællesskab (Ganløse)">
              <View style={styles.pillRow}>
                <Pill label="Før kamp" />
                <Pill label="Ved stadion" />
                <Pill label="Efterkamp" />
                <Pill label="Kun med “Kom alene”" />
              </View>
            </Section>
            <Section title="Events · Ganløse + Offentligt">
              <FlatList
                data={events.ganlose}
                keyExtractor={(item) => item.title}
                renderItem={({ item }) => (
                  <Card title={item.title} subtitle={item.time} meta={`${item.attendees} kommer`}>
                    <View style={styles.pillRow}>
                      {item.tags.map((tag) => (
                        <Pill key={tag} label={tag} />
                      ))}
                    </View>
                  </Card>
                )}
                scrollEnabled={false}
              />
            </Section>
            <Section title="Events · Stadion/Fraktion">
              <FlatList
                data={events.matchday}
                keyExtractor={(item) => item.title}
                renderItem={({ item }) => (
                  <Card title={item.title} subtitle={item.time} meta={`${item.attendees} kommer`}>
                    <View style={styles.pillRow}>
                      {item.tags.map((tag) => (
                        <Pill key={tag} label={tag} />
                      ))}
                    </View>
                  </Card>
                )}
                scrollEnabled={false}
              />
            </Section>
          </>
        );
      case 'inbox':
        return (
          <>
            <Section title="Indbakke">
              {inbox.map((item) => (
                <Card key={item.title} title={item.title} subtitle={item.detail} />
              ))}
            </Section>
            <Section title="Moderator tools">
              <Card title="Read-only kanaler" subtitle="fx #info-fra-capo" meta="Slå til på fraktioner">
                <View style={styles.pillRow}>
                  <Pill label="Skjul indhold hurtigt" />
                  <Pill label="Rapportér beskeder" />
                  <Pill label="Rate limit (MVP senere)" />
                </View>
              </Card>
            </Section>
          </>
        );
      case 'profile':
        return (
          <>
            <Section title="Profil">
              <Card title="Bruger" subtitle="Alex, Ganløse · “Kommer ofte alene”" meta="Captain i Ganløse">
                <View style={styles.pillRow}>
                  <Pill label="Mine fællesskaber: 2" />
                  <Pill label="Mine fraktioner: 1" />
                  <Pill label="Badges: Stemningsskaber" />
                </View>
              </Card>
            </Section>
            <Section title="Feature flags / konfiguration">
              <Card
                title="Tænd/sluk uden app update"
                subtitle="Gemmes i Firestore: config/app"
                meta="Bruges til rollout & kill switch"
              >
                <View style={styles.pillRow}>
                  <Pill label={`songbookEnabled: ${featureFlags.songbookEnabled}`} />
                  <Pill label={`factionsPublic: ${featureFlags.factionsPublic}`} />
                  <Pill label={`readOnlyChannels: ${featureFlags.readOnlyChannels}`} />
                </View>
                <Text style={styles.caption}>
                  Bruges sammen med EAS Update til små UI-ændringer. Større ting → ny App Store build.
                </Text>
              </Card>
            </Section>
            <Section title="Udgivelsesflow">
              <Card title="Hurtige rettelser" subtitle="EAS Update" meta="staging → production">
                <View style={styles.pillRow}>
                  <Pill label="Bugfix uden App Store" />
                  <Pill label="Tekst/UI-justering" />
                </View>
              </Card>
              <Card title="Store ændringer" subtitle="Ny version til App Store" meta="Byg med EAS Build">
                <View style={styles.pillRow}>
                  <Pill label="Nye permissions" />
                  <Pill label="Store features" />
                  <Pill label="Native SDK" />
                </View>
              </Card>
            </Section>
            <Section title="Fan moments">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryRow}>
                {gallery.map((item) => (
                  <ImageBackground
                    key={item.title}
                    source={{ uri: item.image }}
                    style={styles.galleryCard}
                    imageStyle={styles.galleryImage}
                  >
                    <View style={styles.galleryOverlay}>
                      <Text style={styles.galleryTitle}>{item.title}</Text>
                      <Text style={styles.galleryCaption}>{item.caption}</Text>
                    </View>
                  </ImageBackground>
                ))}
              </ScrollView>
            </Section>
          </>
        );
      default:
        return null;
    }
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground source={{ uri: heroArt }} style={styles.heroShell} resizeMode="cover">
        <LinearGradient
          colors={[accent, accentDark]}
          start={{ x: 0.1, y: 0.1 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroOverlay}
        />
        <View style={styles.heroContent}>
          <View style={styles.heroTopRow}>
            <View style={styles.logoBadge}>
              <Image source={{ uri: clubLogo }} style={styles.heroLogo} />
            </View>
            <View style={styles.heroMatchup}>
              <Text style={styles.heroLabel}>Næste kamp</Text>
              <Text style={styles.heroMatchTeams}>FCN vs {match.opponent}</Text>
              <Text style={styles.heroMeta}>{match.datetime} · {match.venue}</Text>
            </View>
            <View style={styles.heroOpponentBadge}>
              <Image source={{ uri: awayLogo }} style={styles.heroLogoSmall} />
              <Text style={styles.heroOpponentText}>{match.opponent}</Text>
            </View>
          </View>
          <Text style={styles.appName}>Velkommen FCN fans</Text>
          <Text style={styles.appTagline}>Byfællesskaber · Fraktioner · Kampdag</Text>
          <View style={styles.heroActions}>
            <TouchableOpacity style={styles.ctaPrimary}>
              <Text style={styles.ctaPrimaryLabel}>Kom i gang</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ctaGhost}>
              <Text style={styles.ctaGhostLabel}>Se demo</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heroBadges}>
            <Pill label="Byfællesskab: Ganløse" />
            <Pill label="Fraktion: Wild Tigers" />
            <Pill label="3 events i dag" />
          </View>
        </View>
      </ImageBackground>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
            >
              <Text style={[styles.tabButtonLabel, isActive && styles.tabButtonLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {tabContent}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: soft,
  },
  heroShell: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    backgroundColor: accent,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.92,
  },
  heroContent: {
    position: 'relative',
    gap: 12,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  logoBadge: {
    height: 64,
    width: 64,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  heroMatchup: {
    flex: 1,
    marginHorizontal: 12,
    gap: 4,
  },
  heroLabel: {
    color: '#ffe6ed',
    fontSize: 13,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  heroMatchTeams: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  heroMeta: {
    color: '#ffe6ed',
    fontSize: 13,
  },
  heroOpponentBadge: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  heroOpponentText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  heroLogo: {
    height: 48,
    width: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  heroLogoSmall: {
    height: 40,
    width: 40,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  appName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
  },
  appTagline: {
    color: '#ffe6ed',
    marginTop: 2,
    fontSize: 15,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 10,
  },
  ctaPrimary: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  ctaPrimaryLabel: {
    color: accent,
    fontWeight: '800',
    fontSize: 15,
  },
  ctaGhost: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ffffff75',
  },
  ctaGhostLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  heroBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tabBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#d7dce5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -10,
    shadowColor: '#0c1a2b',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 3,
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f6f7fb',
  },
  tabButtonActive: {
    backgroundColor: accent,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  tabButtonLabel: {
    color: textSecondary,
    fontWeight: '700',
    fontSize: 13,
  },
  tabButtonLabelActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#0c1a2b',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e7e3df',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: textPrimary,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#f1d6db',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f1d6db',
    gap: 8,
    marginTop: 6,
    shadowColor: '#c8142f',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardImage: {
    height: 140,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 6,
  },
  cardImageRadius: {
    borderRadius: 10,
  },
  cardImageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    padding: 10,
  },
  cardImageLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: textPrimary,
  },
  cardSubtitle: {
    color: textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  cardMeta: {
    color: '#5b6a7e',
    fontSize: 12,
    marginTop: 2,
  },
  cardBadge: {
    color: '#fff',
    backgroundColor: accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: '700',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    backgroundColor: '#fff6f8',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#f1d6db',
  },
  pillText: {
    color: accent,
    fontSize: 12,
    fontWeight: '700',
  },
  caption: {
    color: textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  rowGap: {
    gap: 8,
  },
  stack: {
    gap: 8,
  },
  crestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  crestBox: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  crest: {
    height: 54,
    width: 54,
  },
  vs: {
    color: accent,
    fontWeight: '800',
    fontSize: 18,
  },
  galleryRow: {
    gap: 12,
    paddingRight: 6,
  },
  galleryCard: {
    width: 220,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ffffff55',
  },
  galleryImage: {
    borderRadius: 16,
  },
  galleryOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  galleryTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  galleryCaption: {
    color: '#e8eaf1',
    marginTop: 4,
    fontSize: 12,
  },
});
