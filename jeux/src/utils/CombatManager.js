/**
 * Module de gestion des combats
 * Centralise la logique de combat entre le joueur et les ennemis
 * Affiche un log détaillé de chaque tour dans la console
 */

/**
 * Gère un combat complet entre deux entités
 * Le combat se déroule tour par tour jusqu'à ce que l'un des deux meure
 *
 * @param {Entity} attacker - L'entité qui attaque (Player ou Enemy)
 * @param {Entity} defender - L'entité qui défend (Player ou Enemy)
 * @returns {Object} Résultat du combat { winner: Entity, loser: Entity, turns: number }
 */
export function startCombat(attacker, defender) {
    // Récupérer les noms pour l'affichage
    const attackerName = attacker.constructor.name;
    const defenderName = defender.data?.name || defender.constructor.name;

    console.log(`\n⚔️ ========== DÉBUT DU COMBAT ==========`);
    console.log(`${attackerName} VS ${defenderName}`);
    console.log(`=====================================\n`);

    // Afficher les stats de départ
    console.log(`📊 STATS INITIALES:`);
    console.log(`${attackerName}:`);
    console.log(`  - HP: ${attacker.health}/${attacker.maxHealth}`);
    console.log(`  - Shield: ${attacker.shield}/${attacker.maxShield}`);
    console.log(`  - Atk: ${attacker.atk}`);
    console.log(`  - Speed: ${attacker.speed}`);
    console.log(`  - Hit: ${attacker.hit}`);

    console.log(`\n${defenderName}:`);
    console.log(`  - HP: ${defender.health}/${defender.maxHealth}`);
    console.log(`  - Shield: ${defender.shield}/${defender.maxShield}`);
    console.log(`  - Atk: ${defender.atk}`);
    console.log(`  - Speed: ${defender.speed}`);
    console.log(`  - Hit: ${defender.hit}`);

    // Déterminer qui attaque en premier selon la vitesse
    const attackerFirst = attacker.speed >= defender.speed;

    console.log(`\n⚡ INITIATIVE:`);
    if (attackerFirst) {
        console.log(`${attackerName} attaque en premier (Speed: ${attacker.speed} vs ${defender.speed})`);
    } else {
        console.log(`${defenderName} attaque en premier (Speed: ${defender.speed} vs ${attacker.speed})`);
    }

    // Boucle de combat tour par tour
    let turn = 1;
    while (attacker.health > 0 && defender.health > 0) {
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`           TOUR ${turn}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

        if (attackerFirst) {
            // L'attaquant attaque en premier
            const attackerDmg = calculateDamage(attacker, defender);
            defender.takeDamage(attackerDmg);
            console.log(`\n⚔️  ${attackerName} attaque !`);
            console.log(`   Dégâts infligés: ${attackerDmg}`);
            console.log(`   ${defenderName} HP: ${defender.health}/${defender.maxHealth} (Shield: ${defender.shield}/${defender.maxShield})`);

            // Vérifier si le défenseur est mort
            if (defender.health <= 0) {
                console.log(`\n💀 ${defenderName} est vaincu !`);
                printCombatResult(attackerName, defenderName, attacker, turn);
                return { winner: attacker, loser: defender, turns: turn };
            }

            // Le défenseur contre-attaque
            const defenderDmg = calculateDamage(defender, attacker);
            attacker.takeDamage(defenderDmg);
            console.log(`\n🛡️  ${defenderName} contre-attaque !`);
            console.log(`   Dégâts infligés: ${defenderDmg}`);
            console.log(`   ${attackerName} HP: ${attacker.health}/${attacker.maxHealth} (Shield: ${attacker.shield}/${attacker.maxShield})`);

            // Vérifier si l'attaquant est mort
            if (attacker.health <= 0) {
                console.log(`\n💀 ${attackerName} est vaincu !`);
                printCombatResult(defenderName, attackerName, defender, turn);
                return { winner: defender, loser: attacker, turns: turn };
            }
        } else {
            // Le défenseur attaque en premier
            const defenderDmg = calculateDamage(defender, attacker);
            attacker.takeDamage(defenderDmg);
            console.log(`\n⚔️  ${defenderName} attaque !`);
            console.log(`   Dégâts infligés: ${defenderDmg}`);
            console.log(`   ${attackerName} HP: ${attacker.health}/${attacker.maxHealth} (Shield: ${attacker.shield}/${attacker.maxShield})`);

            // Vérifier si l'attaquant est mort
            if (attacker.health <= 0) {
                console.log(`\n💀 ${attackerName} est vaincu !`);
                printCombatResult(defenderName, attackerName, defender, turn);
                return { winner: defender, loser: attacker, turns: turn };
            }

            // L'attaquant contre-attaque
            const attackerDmg = calculateDamage(attacker, defender);
            defender.takeDamage(attackerDmg);
            console.log(`\n🛡️  ${attackerName} contre-attaque !`);
            console.log(`   Dégâts infligés: ${attackerDmg}`);
            console.log(`   ${defenderName} HP: ${defender.health}/${defender.maxHealth} (Shield: ${defender.shield}/${defender.maxShield})`);

            // Vérifier si le défenseur est mort
            if (defender.health <= 0) {
                console.log(`\n💀 ${defenderName} est vaincu !`);
                printCombatResult(attackerName, defenderName, attacker, turn);
                return { winner: attacker, loser: defender, turns: turn };
            }
        }

        turn++;
    }
}

/**
 * Calcule les dégâts infligés par un attaquant à un défenseur
 * Prend en compte l'attaque de l'attaquant et le bouclier du défenseur
 *
 * @param {Entity} attacker - L'entité qui attaque
 * @param {Entity} defender - L'entité qui défend
 * @returns {number} Dégâts finaux
 */
function calculateDamage(attacker, defender) {
    // Pour l'instant, les dégâts sont simplement l'attaque de l'attaquant
    // Le système de bouclier est géré dans la méthode takeDamage() de Entity
    return attacker.atk;
}

/**
 * Affiche le résultat final du combat dans la console
 *
 * @param {string} winnerName - Nom du gagnant
 * @param {string} loserName - Nom du perdant
 * @param {Entity} winner - Entité gagnante
 * @param {number} turns - Nombre de tours
 */
function printCombatResult(winnerName, loserName, winner, turns) {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`        FIN DU COMBAT`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`\n🏆 VAINQUEUR: ${winnerName}`);
    console.log(`❌ VAINCU: ${loserName}`);
    console.log(`📊 Nombre de tours: ${turns}`);
    console.log(`\n💚 Stats finales du vainqueur:`);
    console.log(`   HP restants: ${winner.health}/${winner.maxHealth}`);
    console.log(`   Shield restant: ${winner.shield}/${winner.maxShield}`);
    console.log(`\n⚔️ ========== FIN DU COMBAT ==========\n`);
}
