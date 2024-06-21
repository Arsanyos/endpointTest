export default class FormatEntity {

    static HOME = "{$competitor1}"
    static AWAY = "{$competitor2}"

    static replaceAll = (data, search, replacement) => {
        return data.split(search).join(replacement)

    }

    static replaceVariablesForSpecifier = (org_specifiers, entity_name, event, lang) => {
        let specifiers = Object.keys(org_specifiers || {}).map(key => ({ name: key, value: org_specifiers[key] }))
        let nth = (n) => (["st", "nd", "rd"][((n + 90) % 100 - 10) % 10 - 1] || "th")

        specifiers.forEach(specifier => {
            entity_name = FormatEntity.replaceAll(entity_name, `{${specifier.name}}`, specifier.value)
            entity_name = FormatEntity.replaceAll(entity_name, `{+${specifier.name}}`, `${specifier.value}`)
            entity_name = FormatEntity.replaceAll(entity_name, `{-${specifier.name}}`, `${specifier.value}`)

        })

        specifiers.forEach(specifier => {

            let value = specifier.value

            if (Number.isInteger(parseFloat(value)))
                value = `${value}${nth(parseInt(value))}`

            entity_name = FormatEntity.replaceAll(entity_name, `{!${specifier.name}}`, value)

        })

        if (event) {
            let home_ = event.hom
            let away_ = event.awy

            entity_name = FormatEntity.replaceAll(entity_name, FormatEntity.HOME, home_)
            entity_name = FormatEntity.replaceAll(entity_name, FormatEntity.AWAY, away_)
        }

        return entity_name

    }

    static formatPickName = (pick_name, event, specifiers) => {
        return FormatEntity.replaceVariablesForSpecifier(specifiers, pick_name, event, 'en')
    }
    //
    static formatMarketName = (market_name, event, specifiers) => {
        return FormatEntity.replaceVariablesForSpecifier(specifiers, market_name, event, 'en')
    }

}