# Mise à jour : Correctifs Appliqués (12 Avril 2026)

L'ensemble des dysfonctionnements critiques identifiés ci-dessus a été corrigé pour permettre un parcours client réel et fonctionnel.

### Correctifs Majeurs :
1. **Implémentation de `StoreDetailScreen`** : L'écran de détail des marchés est désormais fonctionnel. Il récupère dynamiquement la liste des produits via l'API `storesAPI.getProducts(storeId)`.
2. **Correction de la Navigation** : La route `StoreDetail` dans `AppNavigator.tsx` pointe désormais vers le bon écran au lieu de recharger l'accueil.
3. **Tunnel d'Achat Réel (Checkout)** : Le bouton "Commander maintenant" du panier appelle désormais l'API `ordersAPI.create(orderData)` avec les données du panier avant de vider celui-ci.
4. **Authentification Connectée** : Le `LoginScreen` utilise maintenant `authAPI.login` et stocke le token de manière sécurisée avec `expo-secure-store`.
5. **Dynamisation des Écrans (Real Data)** : 
   - `HomeScreen` récupère maintenant les bannières, catégories et magasins depuis l'API.
   - `OrdersScreen` et `OrderDetailScreen` affichent maintenant les vraies commandes de l'utilisateur connecté via l'API.

Toutes les données "en dur" (mocks) ont été soit supprimées, soit remplacées par des appels asynchrones aux services API.

---

## 1. Simulation du Parcours Client (Customer Journey)

### Étape 1 : Ouverture de l'application & Authentification
- L'utilisateur ouvre l'application et atterrit sur le Splash Screen.
- Il est redirigé vers l'écran de connexion (`LoginScreen`).
- Il saisit son numéro de téléphone et son mot de passe.
- **Action simulée** : Clic sur "Se connecter".
- **Résultat** : Un "mock login" avec un `setTimeout` de 1.2 seconde est déclenché. Le token "mock_token" est sauvegardé, et l'utilisateur est reconnu comme "Fatou Diallo". Il est ensuite redirigé vers le Menu Principal (`HomeScreen`).

### Étape 2 : Navigation sur l'Accueil (Home)
- L'utilisateur "Fatou" voit un message d'accueil personnalisé.
- Des bannières (Produits Frais, Poisson Frais) défilent.
- Une liste de catégories (Légumes, Poisson, Viande) s'affiche.
- Une section "Marchés à proximité" affiche des données en dur (ex: Marché Keur Massar).
- **Action simulée** : L'utilisateur clique sur un marché spécifique (ex: "Marché Rufisque") pour voir les produits.
- **Résultat attendu** : Navigation vers un écran de détails du marché (`StoreDetailScreen`).

### Étape 3 : Consultation des Produits & Ajout au Panier
- **Action simulée** : L'utilisateur cherche à afficher la liste des produits disponibles pour un marché donné et clique sur "Ajouter au panier".
- **Résultat** : Impossible (voir section des dysfonctionnements).

### Étape 4 : Consultation du Panier (Cart)
- L'utilisateur se rend dans l'onglet "Panier".
- S'il y a des articles (ajoutés manuellement via l'état global du store Zustand), il peut modifier les quantités.
- Les frais de livraison sont calculés dynamiquement (Gratuit à partir de 10 000 FCFA).
- **Action simulée** : Clic sur "Commander maintenant".
- **Résultat** : Une alerte de confirmation apparaît. Lorsqu'il confirme, le panier se vide localement (`clearCart()`) et l'utilisateur est redirigé vers l'écran des commandes (`OrdersScreen`).

### Étape 5 : Suivi de Commande
- L'utilisateur consulte ses commandes dans `OrdersScreen`.
- Il peut théoriquement sélectionner une commande pour voir les détails sur `OrderDetailScreen`.

---

## 2. Bilan Complet des Dysfonctionnements Possibles (Frictions & Bugs)

L'analyse approfondie du code source a révélé plusieurs dysfonctionnements majeurs qui interrompent le tunnel d'achat de l'utilisateur :

### Dysfonctionnements Bloquants (Critiques)
1. **Redirection Erronée vers le Marché (Dead End) :**
   Dans le fichier de navigation `AppNavigator.tsx`, la route `StoreDetail` est pointée vers... `HomeScreen` !
   ```tsx
   <Stack.Screen name="StoreDetail" component={HomeScreen} />
   ```
   **Conséquence :** Lorsqu'un utilisateur clique sur un marché à proximité, l'application recharge simplement la page d'accueil au lieu d'afficher les produits. Les dossiers `src/screens/stores` et `src/screens/products` sont totalement **vides**. Il est impossible de commander un produit dans l'état actuel de l'application.

2. **Panier "Fantôme" et Absence de Création de Commande en Base de Données :**
   Lors du processus de transaction (Checkout) dans `CartScreen.tsx`, l'application se contente de vider le panier en local et de rediriger l'utilisateur.
   ```tsx
   { text: "Commander", onPress: () => {
       clearCart(); // Vide localement
       navigation.navigate("Orders");
   }}
   ```
   **Conséquence :** L'API (`api.post("/orders", data)`) n'est jamais appelée. La commande de l'utilisateur se perd. Aucun marchand ne recevra la notification, et la transaction ne sera jamais finalisée côté backend.

3. **Authentification Fictive (Mock) :**
   Dans `LoginScreen.tsx`, la connexion à l'API est commentée ou simulée par un simple timeout.
   ```tsx
   // Mock login — replace with real API call
   setTimeout(() => {
     setUser({ id: "1", name: "Fatou Diallo", email: "fatou@gmail.com", phone }, "mock_token")
   }, 1200)
   ```
   **Conséquence :** Tous les utilisateurs qui se connectent deviennent "Fatou Diallo" et aucun contrôle mot de passe / numéro n'est vérifié en base.

### Problèmes d'Expérience Utilisateur (UX / UI)
1. **Données Mockées ("En dur") omniprésentes :**
   L'écran `HomeScreen` n'exploite pas l'API. Les listes `BANNERS`, `CATEGORIES`, et `STORES` y sont déclarées de manière statique au lieu d'utiliser `storesAPI.getAll()` et `categoriesAPI.getAll()`. Si des modifications sont faites côté back-office, elles ne se répercutent pas ici en l'état.

2. **Gestion des Erreurs API manquante :**
   Bien que l'instance globale `api.ts` intercepte et renvoie les erreurs réseau (`Promise.reject()`), il n'y a quasiment aucune gestion des exceptions (blocs `try...catch` + UI Feedback) dans les composants React pour avertir l'utilisateur d'un problème métier.

3. **La Recherche est inactive :**
   Le champ de texte "Rechercher produits, marchés..." présent dans l'écran d'accueil garde sa valeur dans un état local `search`, mais il n'existe aucune logique d'implémentation pour l'utiliser.

4. **Gestion de Profil et Wallet inachevée ou absente :**
   Les écrans comme `WalletScreen` ou `ProfileScreen` semblent être gérés par la navigation, mais les appels aux API disponibles (`walletAPI.getBalance()`, etc.) ne sont pas connectés.

---

## 3. Recommandations de Remédiation Prioritaires
1. **Implémenter les Écrans Marchés & Produits :**
   Créer d'urgence `StoreDetailScreen.tsx` et `ProductListScreen.tsx` pour permettre la consultation de produits via un appel à `storesAPI.getProducts(id)`. Corriger le mapping de l'AppNavigator.
2. **Brancher les Appels API "Real World" :**
   Remplacer les "mocks" de `LoginScreen` et de `CartScreen` par les vrais appels asynchrones présents dans `services/api.ts` (`authAPI.login` et `ordersAPI.create`).
3. **Récupérer le Catalogue Backend :**
   Remplacer les constantes textuelles (const BANNERS/CATEGORIES/STORES) par une gestion de l'état asynchrone pour lister les marchés de la base de données.
