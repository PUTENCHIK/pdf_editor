import clip_icon from '../images/common/clip_icon.svg'
import clip_icon_active from '../images/common/clip_icon_active.svg'

import delete_icon from '../images/common/delete_icon.svg'
import delete_icon_active from '../images/common/delete_icon_active.svg'

import swap_icon from '../images/common/swap_icon.svg'
import swap_icon_active from '../images/common/swap_icon_active.svg'

import rotate_icon from '../images/common/rotate_icon.svg'
import rotate_icon_active from '../images/common/rotate_icon_active.svg'

import insert_image_icon from '../images/common/insert_image_icon.svg'
import insert_image_icon_active from '../images/common/insert_image_icon_active.svg'

const rightMenuTools = [
    {
        name: "delete_page",
        title: "Удалить страницу",
        icon: delete_icon,
        icon_active: delete_icon_active
    },
    {
        name: "swap_pages",
        title: "Поменять страницы местами",
        icon: swap_icon,
        icon_active: swap_icon_active
    },
    {
        name: "rotate_pages",
        title: "Повернуть страницы",
        icon: rotate_icon,
        icon_active: rotate_icon_active
    },
    {
        name: "crop_page",
        title: "Обрезать страницу",
        icon: clip_icon,
        icon_active: clip_icon_active
    },
    {
        name: "insert_image",
        title: "Вставить изображение",
        icon: insert_image_icon,
        icon_active: insert_image_icon_active
    },
];

export default rightMenuTools;