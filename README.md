# discord-antiraid
Npm for protect server for Raid attacks


COMMENT SE CONNECTER
Afin d'accéder à notre API, vous devez d'abord vous authentifier avec votre Clef API fournie plus haut.
Pour vous connecter ajouter le paramètre ?apiKey= suivi de votre clé API.
Exemple : https://protect-bot.fr/api/?apiKey=MA:CLEF:API:ICI

Il est possible de modifier le type de données retourné grâce au paramètre &type=json
Exemple : https://protect-bot.fr/api/?apiKey=MA:CLEF:API:ICI&type=json
INFORMATIONS SUR UN UTILISATEUR GRACE A SON IDENTIFIANT DISCORD
Notre API permet d'obtenir des informations sur un compte discord avec son ID. Pour obtenir un identifiant Discord vous devez activer le mode développeur sur votre logiciel Discord. Pour se faire rendez vous dans Paramètres > Avancés et cochez "Mode développeur".
Savoir si l'utilisateur est dans notre Blacklist
Vous devez vous rendre sur le lien de l'api dans lequel il doit être indiqué votre clef. Vous devez ensuite ajouter le paramètre &checkblacklist= suivi de l'identifiant Discord de l'utilisateur.
Exemple : https://protect-bot.fr/api/?apiKey=MA:CLEF:API:ICI&checkblacklist=ID_DISCORD
Obtenir l'avatar d'un utilisateur
Vous devez vous rendre sur le lien de l'api dans lequel il doit être indiqué votre clef. Vous devez ensuite ajouter le paramètre &avatarUrl= suivi de l'identifiant Discord de l'utilisateur.
Exemple : https://protect-bot.fr/api/?apiKey=MA:CLEF:API:ICI&avatarUrl=ID_DISCORD
Obtenir les informations Discord d'un utilisateur
Vous devez vous rendre sur le lien de l'api dans lequel il doit être indiqué votre clef. Vous devez ensuite ajouter le paramètre &getuser= suivi de l'identifiant Discord de l'utilisateur.
Exemple : https://protect-bot.fr/api/?apiKey=MA:CLEF:API:ICI&getuser=ID_DISCORD