const getEntityName = (entity) => {
    return entity.data?.name || entity.constructor.name;
};

const logCombatStart = (attacker, defender) => {
    const attackerName = getEntityName(attacker);
    const defenderName = getEntityName(defender);

    console.log(`\n⚔️ ========== COMBAT START ==========`);
    console.log(`${attackerName} VS ${defenderName}`);
    console.log(`====================================\n`);
};

const logStats = (entity) => {
    const name = getEntityName(entity);
    console.log(`${name}:`);
    console.log(`  HP: ${entity.health}/${entity.maxHealth}`);
    console.log(`  Shield: ${entity.shield}/${entity.maxShield}`);
    console.log(`  Atk: ${entity.atk}`);
    console.log(`  Speed: ${entity.speed}`);
    console.log(`  Hit: ${entity.hit}`);
};

const logInitiative = (attacker, defender, attackerFirst) => {
    const attackerName = getEntityName(attacker);
    const defenderName = getEntityName(defender);

    console.log(`\n⚡ INITIATIVE:`);
    if (attackerFirst) {
        console.log(`${attackerName} attacks first (Speed: ${attacker.speed} vs ${defender.speed})`);
    } else {
        console.log(`${defenderName} attacks first (Speed: ${defender.speed} vs ${attacker.speed})`);
    }
};

const logAttack = (attacker, defender, damage) => {
    const attackerName = getEntityName(attacker);
    const defenderName = getEntityName(defender);

    console.log(`\n⚔️  ${attackerName} attacks!`);
    console.log(`   Damage: ${damage}`);
    console.log(`   ${defenderName} HP: ${defender.health}/${defender.maxHealth} (Shield: ${defender.shield}/${defender.maxShield})`);
};

const logDeath = (entity) => {
    const name = getEntityName(entity);
    console.log(`\n💀 ${name} defeated!`);
};

const logCombatResult = (winnerName, loserName, winner, turns) => {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`        COMBAT END`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`\n🏆 WINNER: ${winnerName}`);
    console.log(`❌ DEFEATED: ${loserName}`);
    console.log(`📊 Turns: ${turns}`);
    console.log(`\n💚 Winner stats:`);
    console.log(`   HP: ${winner.health}/${winner.maxHealth}`);
    console.log(`   Shield: ${winner.shield}/${winner.maxShield}`);
    console.log(`\n⚔️ ========== COMBAT END ==========\n`);
};

const calculateDamage = (attacker, defender) => {
    return attacker.atk;
};

const executeTurn = (first, second, turn) => {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`           TURN ${turn}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    const firstDmg = calculateDamage(first, second);
    second.takeDamage(firstDmg);
    logAttack(first, second, firstDmg);

    if (second.health <= 0) {
        logDeath(second);
        return { winner: first, loser: second };
    }

    const secondDmg = calculateDamage(second, first);
    first.takeDamage(secondDmg);
    logAttack(second, first, secondDmg);

    if (first.health <= 0) {
        logDeath(first);
        return { winner: second, loser: first };
    }

    return null;
};

export function startCombat(attacker, defender) {
    const attackerName = getEntityName(attacker);
    const defenderName = getEntityName(defender);

    logCombatStart(attacker, defender);

    console.log(`📊 INITIAL STATS:`);
    logStats(attacker);
    console.log();
    logStats(defender);

    const attackerFirst = attacker.speed >= defender.speed;
    logInitiative(attacker, defender, attackerFirst);

    let turn = 1;
    while (attacker.health > 0 && defender.health > 0) {
        const result = attackerFirst
            ? executeTurn(attacker, defender, turn)
            : executeTurn(defender, attacker, turn);

        if (result) {
            const winnerName = getEntityName(result.winner);
            const loserName = getEntityName(result.loser);
            logCombatResult(winnerName, loserName, result.winner, turn);
            return result;
        }

        turn++;
    }
}
