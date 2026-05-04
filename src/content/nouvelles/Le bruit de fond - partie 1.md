---
title: Le bruit de fond - partie 1
date: 2026-05-02
genre: fragment
description: "Léna est technicienne en neuroimagerie. Son travail : surveiller les scanners d'une étude sur le sommeil. Des nuits seule, devant des cerveaux qui dorment..."
stade: graine
illustration: /images/nouvelles/lena-v1.png
---
## Le service de nuit

Le scanner numéro trois avait une respiration.

Léna l'avait remarqué la première semaine, il y a deux ans, et n'en avait jamais parlé à personne. Ce n'était pas un bruit. Les machines du laboratoire de neuroimagerie du CHU de Grenoble étaient silencieuses par design, insonorisées, logées dans leurs alcôves comme des organes dans un corps trop propre. C'était plutôt une variation imperceptible dans la fréquence du voyant de veille. Une pulsation. Régulière comme une marée.

Elle savait que c'était électrique. Un défaut de condensateur, probablement. Elle avait décidé de ne pas le signaler.

Le service de nuit commençait à vingt-deux heures et finissait à six heures du matin. Huit heures pendant lesquelles Léna Vasquez, technicienne en neuroimagerie depuis sept ans, surveillait des cerveaux qui dormaient. Le protocole était simple : trois sujets par nuit, acquisition continue, vérification des électrodes toutes les deux heures, rapport au format standardisé déposé dans le serveur avant l'arrivée de l'équipe de jour. L'étude s'appelait SOMNIA-4 et cherchait des corrélations entre architecture du sommeil profond et marqueurs précoces de neurodégénérescence. C'était une bonne étude. Sérieuse. Financée correctement. Léna n'en connaissait pas les conclusions préliminaires parce qu'elle n'était pas chercheuse. Elle était le regard dans le noir, la main qui ajuste, la présence que les protocoles exigent sans nommer.

Cette nuit-là, les trois sujets s'appelaient, dans le système, S-441, S-442 et S-443. Deux hommes, une femme. Léna ne connaissait pas leurs vrais noms. Elle connaissait leurs cerveaux.

S-441 avait une activité temporale droite légèrement élevée en phase N2 — quelque chose que le Dr Mariani avait noté sans conclure. S-442 dormait comme une pierre, un sommeil presque trop régulier, beau à regarder sur les courbes. S-443, la femme, avait tendance à des micro-éveils vers deux heures du matin, de petites remontées vers la surface avant de replonger, comme si quelque chose l'appelait brièvement et renonçait.

Léna les regardait sur ses trois écrans. Les cerveaux en fausses couleurs — bleu pour le repos, vert pour l'activité modérée, les rares irruptions de jaune quand un rêve traversait. Elle aimait ces heures. Elle ne l'aurait pas dit comme ça à quelqu'un — _j'aime regarder les cerveaux dormir_ — mais c'était vrai. Il y avait quelque chose de privilégié dans cette position. Être éveillée pendant que d'autres étaient ailleurs. Garder quelque chose sans qu'on vous l'ait demandé.

À minuit quarante, elle fit sa vérification de routine. S-441 : normal. S-442 : normal. S-443 : micro-éveil précoce ce soir, inhabituel, mais dans les marges. Elle nota, elle ajusta, elle resservit du café dans le mug qu'elle posait toujours à gauche du clavier central.

C'est en reposant le mug qu'elle fit l'erreur.

Son coude gauche heurta la souris. Sur l'écran central, deux fenêtres d'acquisition glissèrent l'une sur l'autre — S-441 et S-443 superposés par accident, leurs signaux se confondant en un seul affichage. Lena tendit la main pour séparer les fenêtres.

Elle s'arrêta.

Les courbes ne se superposaient pas de façon aléatoire. Deux signaux distincts, deux crânes distincts, deux systèmes nerveux sans aucun lien — et leurs activités de fond, le murmure constant sous les architectures du sommeil, ce que les techniciens appelaient entre eux le _bruit de fond_, s'alignaient.

Pas approximativement.

Parfaitement.

Léna posa le mug. Elle se pencha vers l'écran. Elle sépara les fenêtres, les superimposa manuellement cette fois, avec précision. Calibra les échelles. Vérifia les unités. Recommença.

Les deux signaux battaient ensemble comme un seul cœur.

Elle pensa : _bug d'affichage_. Elle pensa : _dérive de l'étalonnage_. Elle pensa à six explications techniques en quarante secondes, et pour chacune elle sut immédiatement comment la tester et immédiatement que ce n'était pas ça.

Elle ouvrit le signal de S-442. Le superimposa aux deux autres.

Le silence du laboratoire changea de texture.

Dehors, il devait faire froid. Grenoble en novembre. Lena ne regardait pas dehors. Elle regardait trois cerveaux qui ne se connaissaient pas, qui ne s'étaient jamais rencontrés, qui dormaient dans trois alcôves séparées par des cloisons de plomb et qui, dans le registre le plus profond de leur activité neurale, parlaient exactement le même langage.

Elle ne bougea pas pendant longtemps.

Puis elle ouvrit les archives.

## Les archives

La base de données de SOMNIA-4 contenait quatre cent quarante-trois sujets.

Léna le savait. Elle avait elle-même enregistré la plupart des dossiers, nuit après nuit depuis le début de l'étude, dix-huit mois plus tôt. Elle connaissait le système de classement, les conventions de nommage, les anomalies d'encodage du serveur qui faisaient que les fichiers antérieurs à mars de l'année précédente prenaient trois secondes de plus à s'ouvrir. Elle connaissait cette base de données comme on connaît un appartement dans lequel on a vécu longtemps — par le corps, pas par la pensée.

Elle n'y avait jamais cherché ce qu'elle cherchait maintenant.

Elle commença méthodiquement. Pas par peur de ce qu'elle trouverait. Elle n'avait pas encore de peur, seulement une attention très haute, le genre d'état qu'elle reconnaissait des nuits où quelque chose dans les courbes ne correspondait pas aux notes cliniques et où il fallait comprendre avant l'arrivée de l'équipe de jour. Elle isola la composante du signal qui l'intéressait. Le bruit de fond. Techniquement : l'activité spontanée infrabasale, la strate la plus basse du signal EEG, celle qu'on filtre normalement parce qu'elle ne contient rien d'utile pour les études de sommeil. Elle écrivit un script simple pour l'extraire de chaque fichier. Ses doigts allaient vite. Elle n'avait pas besoin de réfléchir à la syntaxe.

Le script tourna pendant onze minutes.

Puis les résultats s'affichèrent.

Elle les regarda sans comprendre ce qu'elle regardait. Puis elle comprit et continua à ne pas bouger parce que bouger aurait rendu la chose réelle d'une façon pour laquelle elle n'était pas prête.

Sur quatre cent quarante-trois sujets, le signal infrabasal était identique chez quatre cent quarante-trois sujets.

Pas similaire. Pas corrélé. Pas dans les mêmes gammes de fréquence.

Identique.

La même forme d'onde. La même modulation. Le même motif qui se répétait toutes les — elle calcula — toutes les quatre virgule sept secondes environ, avec une régularité qui n'avait rien à voir avec la biologie individuelle parce que la biologie individuelle ne fonctionnait pas comme ça. Les cerveaux étaient des organes variables, capricieux, marqués par l'âge et le stress et la génétique et ce qu'on avait mangé la veille. Deux cerveaux ne produisaient jamais exactement le même signal. C'était un axiome. C'était la base.

Sauf là.

Léna se leva. Elle marcha jusqu'à la fenêtre du couloir — pas celle du laboratoire, il n'y en avait pas, mais celle du couloir qui donnait sur le parking du CHU. Il était une heure vingt-trois du matin. Le parking était presque vide. Un homme fumait près de l'entrée des urgences, emmitouflé dans un manteau trop grand. Elle le regarda une dizaine de secondes.

Elle pensa : _est-ce qu'il l'a aussi ?_

Elle retourna s'asseoir.

---

La deuxième chose qu'elle chercha, c'était une exception. Un sujet chez qui le signal serait absent ou différent. Une déviation qui lui permettrait de construire une hypothèse — une pathologie, une particularité anatomique, quelque chose qui dessinerait la règle par son absence.

Elle ne trouva pas d'exception.

Elle chercha une corrélation avec l'âge. Rien. Avec le sexe. Rien. Avec les diagnostics préliminaires — certains sujets de SOMNIA-4 présentaient des marqueurs précoces de la maladie qu'on cherchait, d'autres non. Aucune différence dans le signal infrabasal. La neurodégénérescence ne le touchait pas. La santé ne le touchait pas. Il était en dessous de tout ça, indifférent à ce qui se passait dans les strates supérieures du cerveau, comme un socle qui restait stable pendant que tout le reste s'érodait ou prospérait.

À deux heures moins dix, elle élargie la recherche.

SOMNIA-4 était hébergée sur le même serveur que trois autres études longitudinales du laboratoire. Lena n'avait pas accès en écriture à ces bases — protocole éthique, données de tiers — mais elle avait accès en lecture, pour les besoins de maintenance. Elle n'avait jamais utilisé cet accès pour autre chose que vérifier des formats de fichiers.

Elle l'utilisa maintenant.

NEURO-AGING : deux cent douze sujets, étude sur le vieillissement cérébral, données collectées sur six ans.

Elle extrait les signaux infrabassaux.

Elle les compara.

Son script mit huit minutes. Elle but son café froid sans y penser.

Les résultats : identiques.

PÉDIATRIE-SOMM : quatre-vingt-sept sujets entre six et douze ans.

Identiques.

TRAUMA-C : cinquante-neuf sujets avec lésions cérébrales acquises, une population dont les architectures neurales avaient été physiquement réorganisées par des accidents, des AVC, des tumeurs opérées.

Elle s'arrêta avant de lancer le script. Elle pensa : _si le signal survit à ça, alors il n'est pas neural._ Elle pensa : _ou alors il est neural d'une façon qu'on ne comprend pas encore._ Elle pensa : _lance le script._

Elle lança le script.

Identiques.

---

À deux heures quarante, Léna fit quelque chose qu'elle n'avait jamais fait pendant un service de nuit.

Elle ferma les yeux.

Pas pour dormir. Pour faire le vide, comme on nettoie une surface avant d'y poser quelque chose de fragile. Elle voulait regarder ce qu'elle savait sans les mots qui l'habillaient, sans les cadres interprétatifs qui s'étaient mis en place automatiquement depuis minuit quarante — _bug_, _artefact_, _étalonnage_, _coïncidence statistique_, tous ces réflexes protecteurs qui permettent aux chercheurs et aux techniciens de ne pas s'effondrer face à des données qui ne rentrent pas.

Ce qu'elle savait, sans les mots :

Huit cent un cerveaux humains, de six à quatre-vingt-deux ans, sains ou malades, intacts ou reconstruits, produisaient en permanence, en dessous de tout ce qui les distinguait, le même signal. Un motif qui se répétait toutes les quatre virgule sept secondes. Régulier comme une marée.

Régulier comme la respiration du scanner numéro trois.

Elle rouvrit les yeux.

Elle pensa à quelque chose que le Dr Mariani avait dit lors d'une réunion d'équipe, six mois plus tôt, une remarque en passant dont personne n'avait fait grand chose : _le bruit de fond, c'est ce qu'on enlève pour voir le cerveau. Mais personne ne s'est jamais demandé ce que c'était._

Personne ne s'était demandé.

Parce que c'était du bruit.

Parce que le bruit n'est rien.

Léna posa ses deux mains à plat sur le bureau. Elle regarda ses paumes. Elle pensa, très clairement, avec une précision qui lui parut presque comique : _il faut que je scanne mon propre cerveau._

Dans l'alcôve numéro deux, S-442 dormait de son sommeil parfait. Dans l'alcôve numéro trois, S-443 venait d'entamer son micro-éveil précoce — Léna le vit sur l'écran sans se lever, une petite remontée vers la surface, quelques secondes, puis la replongée.

Quelque chose l'appelait brièvement.

Et renonçait.

## 3h14

Elle aurait pu appeler quelqu'un.

C'était la première pensée cohérente qui traversa Léna depuis minuit quarante — depuis la superposition accidentelle, les archives, les huit cent un cerveaux identiques dans leur fond. Elle aurait pu appeler le Dr Mariani. Ou la chef de protocole. Ou simplement noter l'anomalie dans le rapport de nuit et laisser quelqu'un d'autre décider quoi en faire.

Elle ne le fit pas.

Elle remarqua qu'elle ne le faisait pas. Elle se regarda ne pas le faire avec une curiosité détachée, comme on observe sa propre main hésiter au-dessus d'un bouton sans comprendre pourquoi elle hésite. Il y avait quelque chose dans ce qu'elle avait trouvé qui rendait le partage prématuré — pas impossible, pas interdit, juste _prématuré_. Comme si la chose avait besoin de rester dans le noir encore un peu. De ne pas encore être nommée par quelqu'un d'autre.

Elle connaissait ce sentiment. Elle ne savait pas d'où elle le connaissait.

---

Le casque EEG du laboratoire était rangé dans le troisième tiroir du meuble d'équipement, dans sa housse rembourrée grise. Il servait aux calibrations, aux tests de matériel, aux démonstrations pour les stagiaires. Lena l'avait utilisé une dizaine de fois. Elle connaissait la procédure — gel conducteur sur les électrodes, placement standardisé selon le système 10-20, vérification de l'impédance avant acquisition.

Elle sortit le casque.

Elle ne se demanda pas si c'était autorisé. Ce n'était pas une question qui se posait — pas parce qu'elle l'écartait, mais parce qu'elle ne venait tout simplement pas. Ce qui venait à la place était plus simple et plus profond : elle avait besoin de savoir. Pas pour un rapport. Pas pour une publication. Pour elle-même, dans ce laboratoire, à trois heures du matin, avec trois inconnus endormis de l'autre côté des cloisons de plomb.

Elle prépara le gel. Elle plaça les électrodes. Elle vérifia l'impédance — bonne, propre, le contact était correct. Ses gestes étaient précis parce qu'ils étaient habituels. Elle pensa : _c'est étrange de faire quelque chose d'inhabituel avec des gestes habituels_. Elle pensa que c'était peut-être toujours comme ça — que les moments qui changent quelque chose se glissent dans des gestes ordinaires sans se signaler.

Elle lança l'acquisition.

---

Les premières données apparurent sur l'écran. Son cerveau éveillé, attentif, légèrement tendu — les ondes beta dominaient, rapides et serrées, la signature d'un esprit qui travaille. Elle reconnut le tracé. Elle avait vu des milliers de tracés d'éveil. Celui-ci lui ressemblait, sans qu'elle puisse dire exactement en quoi.

Elle attendit.

Ce qu'elle cherchait était en dessous. Bien en dessous. Elle ajusta les filtres pour laisser passer les très basses fréquences — celles qu'on élimine normalement. L'écran se remplit brièvement de bruit, d'artefacts, de la respiration de ses propres poumons qui déplaçaient légèrement les électrodes. Elle immobilisa sa respiration trente secondes. Inspira très doucement. Trouva un rythme.

Le signal se stabilisa.

Et là, dans le plancher de son propre cerveau, elle le vit.

La même vague. Lente, régulière, revenue toutes les quatre virgule sept secondes comme une marée qui ne connaît pas les horaires humains. La même forme exacte que chez S-441, S-442, S-443. Que chez les huit cent un sujets des archives. La même que chez l'homme au manteau trop grand qui fumait dans le parking, probablement, si on le branchait maintenant et qu'on regardait assez bas.

Léna regarda son propre bruit de fond sur l'écran.

Elle essaya de ressentir quelque chose de précis et n'y arriva pas. Ce qu'elle ressentait n'avait pas de bord net — ce n'était pas de la peur, ce n'était pas de l'émerveillement, ce n'était pas le vertige qu'elle avait vaguement anticipé. C'était plus proche de la **reconnaissance**. Comme entendre dans une langue étrangère un mot qui ressemble à un mot qu'on connaît. Pas la même chose. Mais quelque chose dedans qui répond.

Elle se demanda si ce qu'elle éprouvait venait d'elle.

La question était sérieuse. Si ce signal traversait tous les cerveaux humains en permanence — si c'était une réception plutôt qu'une production — alors ses émotions de cette nuit, cette attention très haute, cette nécessité de rester seule avec la découverte, cette _reconnaissance_ maintenant — d'où venaient-elles exactement ? De Lena Vasquez, technicienne, trente-quatre ans, Grenoble ? Ou de quelque chose qui passait à travers Lena Vasquez comme la lumière traverse un prisme, se colorant au passage de ce qu'elle était, mais ne venant pas d'elle ?

Elle ne savait pas.

Elle remarqua qu'elle ne savait pas avec une précision inhabituelle.

---

À trois heures vingt, elle retira le casque. Elle nettoya les électrodes, rangea le gel, remit la housse grise dans le troisième tiroir. Elle fit tout ça lentement, complètement, sans laisser de trace — non pas par culpabilité mais par une sorte de soin. Comme on remet en ordre quelque chose qu'on a emprunté à quelqu'un qui ne sait pas qu'on le lui a emprunté.

Avant de refermer le tiroir elle s'arrêta une seconde.

Elle pensa à quelque chose qu'elle n'avait pas pensé depuis longtemps — une image d'enfance, la mer la nuit, une plage dans le Sud, elle devait avoir huit ans. Sa mère dormait sur le sable derrière elle et Lena était debout face à l'eau noire. Les vagues arrivaient régulièrement. Elle avait essayé de compter le temps entre chaque vague et n'y était pas arrivée parce que la régularité était trop parfaite — son esprit d'enfant glissait dessus, ne trouvait pas de prise.

Elle n'avait pas pensé à cette nuit depuis vingt-six ans.

Elle referma le tiroir.

