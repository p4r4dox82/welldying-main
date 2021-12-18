

export const parseDate = (date: Date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${year}. ${month}. ${day}`;
    // `${hour < 12 ? '오전' : '오후'} ${(hour + 11) % 12 + 1}시 ${minute}분 ${second}초`;
}

export const oneByte = /[\sa-zA-Z0-9`~!@#$%^&*()_+-={}\[\];':",./<>?]/;