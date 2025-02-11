import User from '../models/userModel/userSchema.js'

const allBook = async (req, res) =>{
    try {
        const user = await User.findOne({ _id: req.id })

        const books = [
            { coverPage: "EnglishCoverPage.jpg", title: 'English Book', file: 'English' }
        ];

        res.status(200).render("allBooks", {user, books})
    } catch (error) {
        console.log("All Books Error", error)
    }
}


const book = async (req, res) =>{
    try {
        const user = await User.findOne({ _id: req.id })
        const { filename } = req.params;
        res.status(200).render('book', { filename, user });
    } catch (error) {
        console.log("Book Error", error)
    }
}

export {
    allBook, book
}