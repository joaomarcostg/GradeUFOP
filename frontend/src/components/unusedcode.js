function changeText(selector, options, length) {
    const elements = document.querySelectorAll(selector);
    // console.log(elements)
    const tail = '...';
    if (elements && elements.length) {
        let i = 0;
        for (const element of elements) {
            let text = options[i]
            if (text.length < length) {
                element.innerText = text;

            }
            else {
                element.innerText = `${text.substring(0, length - tail.length).trim()}${tail}`;
            }
            i++;
        }
    }
}

function shortString(selector, width, options) {
    // console.log('a')
    if (width < 500) {
        changeText(selector, options, 35)
    }
    else if (width < 600) {
        changeText(selector, options, 40)
    }
    else if (width < 750) {
        changeText(selector, options, 45)
    }
    else if (width < 900) {
        changeText(selector, options, 50)
    }
    else if (width >= 900 && width < 1000) {
        changeText(selector, options, 40)
    }
    else if (width >= 1000) {
        changeText(selector, options, 50)
    }
}

    window.onload = () => {
        setInterval(() => {
            var x = document.getElementById('get_depto')
            let value = x.options[x.selectedIndex].text
            console.log(value)
        }, 1000)
    }

    window.onload = function () {

        const options = []
        const elements = document.querySelectorAll('.short');
        if (elements && elements.length) {
            for (const element of elements) {
                let text = element.innerText;
                // let id = element.value;
                options.push(text)
            }
        }
        const wd = this.window.innerWidth
        const hd = this.window.innerHeight
        if (hd < 900 && wd < 450) {
            shortString('.short', wd, options)
        }
        else {


            setInterval(() => {
                var width = this.window.innerWidth
                shortString('.short', width, options)
                // console.log(width)
            }, 100);
        }
    };
