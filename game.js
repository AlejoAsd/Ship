// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(500, 500, Phaser.AUTO, 'game_div');
var game_state = {};

// Creates a new 'main' state that wil contain the game
game_state.main = function () {};
game_state.main.prototype = {

    preload: function () {
        // Function called first to load all the assets
        game.load.image('ship', 'resources/images/ship.png');
    },

    create: function () {
        // Fuction called after 'preload' to setup the game
        ship = game.add.sprite(250, 300, 'ship');
        ship.anchor.setTo(0.5,0.5);

        keyboard = game.input.keyboard;

        velocity_translation = 0;
        velocity_rotation = 0;
        acceleration_translation = 1;
        acceleration_rotation = Math.PI / 64;
        drag_translation_base = .1;
        drag_translation_percentage = 0.01;
        drag_rotation_base = Math.PI / 128;
        drag_rotation_percentage = 0.01;

        max_velocity_translation = 15;
        max_velocity_rotation = Math.PI / 32;
        max_acceleration_translation = 20;
        max_acceleration_rotation = Math.PI / 2;
    },

    update: function () {
        

        /// Input
        //game.input.update();
        // Acceleration
        if (keyboard.isDown(Phaser.Keyboard.UP))
            velocity_translation += acceleration_translation;
        else if (keyboard.isDown(Phaser.Keyboard.DOWN))
            velocity_translation -= acceleration_translation;

        // Rotation
        if (keyboard.isDown(Phaser.Keyboard.LEFT))
            velocity_rotation -= acceleration_rotation;
        else if (keyboard.isDown(Phaser.Keyboard.RIGHT))
            velocity_rotation += acceleration_rotation;

        // Drag
        sign = get_sign(velocity_translation);
        velocity_translation += -sign * (drag_translation_base + drag_translation_percentage * velocity_translation);
        if (sign != get_sign(velocity_translation) && velocity_translation != 0)
            velocity_translation = 0;

        sign = get_sign(velocity_rotation);
        velocity_rotation += -sign * (drag_rotation_base + drag_rotation_percentage * velocity_rotation);
        if (sign != get_sign(velocity_rotation) && velocity_rotation != 0)
            velocity_rotation = 0;

        /// Limits
        sign = get_sign(velocity_translation);
        if (Math.abs(velocity_translation) > max_velocity_translation)
            velocity_translation = sign * max_velocity_translation;

        sign = get_sign(velocity_rotation);
        if (Math.abs(velocity_rotation) > max_velocity_rotation)
            velocity_rotation = sign * max_velocity_rotation;

        /// Update
        // Rotation
        ship.rotation += velocity_rotation;

        // Translation
        ship.position.y += Math.sin(ship.rotation) * velocity_translation;
        ship.position.x += Math.cos(ship.rotation) * velocity_translation;

        /// Boundaries
        size = ship.getBounds()
        // Width
        if (ship.position.x > game.width + ship.width / 2)
            ship.position.x = -ship.width / 2 + 1;
        else if (ship.position.x < -ship.width / 2)
            ship.position.x = game.width + ship.width / 2 - 1;
        // Height
        if (ship.position.y > game.height + ship.height / 2)
            ship.position.y = -ship.height / 2 + 1;
        else if (ship.position.y < -ship.height / 2)
            ship.position.y = game.height + ship.height / 2 - 1;
    },

};

function get_sign(n)
{
    return n >= 0 ? 1 : -1;
}

// Add and start the 'main' state to start the game
game.state.add('main', game_state.main);
game.state.start('main');