(async () => {
    let search_url_queries = [ '/* backpack.tf premium url */' ]

    const item_name = '/* file name */'
    const pages = 667

    for (let search_url_query of search_url_queries) {
        const item_data = []

        const url_obj = new URL(search_url_query)
        url_obj.searchParams.delete('page')
        search_url_query = url_obj.toString()

        for (let page = 1; page <= pages; page++) {
            console.clear()
            console.log(`[${page}/${pages}] Work in progress...`)

            const built_search_url_query = (search_url_query + ('&page=' + page))

            const response = await fetch(built_search_url_query)

            const html = await response.text()
            const $html = $(html)

            const alert_popup = ($html.find('div.alert.alert-warning').length > 0)

            if (alert_popup) {
                console.log(`[${page}/${pages}] 100%`)
                break
            }

            $html.find('li.item[data-custom_name], li.item[data-custom_desc]').each((i, $item) => {
                $item = $($item)

                const name = $item.attr('data-custom_name')
                const description = $item.attr('data-custom_desc')

                item_data.push({name, description})
            })

            await new Promise((r) => {
                setTimeout(r, 1000)
            })
        }

        save(item_data, item_name)
    }
})()

function save(item_data, item_name) {
    const blob = new Blob([JSON.stringify(item_data, null, 2)], {type: 'text/plain'})
    const blob_url = URL.createObjectURL(blob)
    const file_name = (item_name + '.json')

    const link = document.createElement('a')
    link.href = blob_url
    link.download = file_name
    link.click()
}
