/*
 * Creates a ship object.
 * :param game: Target game.
 * :param x: X position.
 * :param y: Y position.
 * :param sprite: Target sprite for ship. Anchor is automatically set to the middle.
 * :param controls: An object with a list of Phaser.Key objects for the following entries:
 *					'up' : Acceleration.
 *					'down' : Deacceleration.
 *					'left' : Rotation.
 *					'right' : Rotation.
 */
Ship = function (game, x, y, sprite, controls)
	{
		s = game.add.sprite(x, y, sprite);
		s.anchor.set(0.5);

		if (controls === undefined)
		{
			s.controls = 
			{
				'up' : 
				[
					Phaser.Keyboard.W,
					Phaser.Keyboard.UP
				],
				'down' : 
				[
					Phaser.Keyboard.S,
					Phaser.Keyboard.DOWN
				],
				'left' : 
				[
					Phaser.Keyboard.A,
					Phaser.Keyboard.LEFT
				],
				'right' : 
				[
					Phaser.Keyboard.D,
					Phaser.Keyboard.RIGHT
				],
			};
		}
		else
			s.controls = controls;

		s.velocity = 
		{
			'magnitude' : 0,
			'acceleration' : 700,
			'max' : 500,
			'drag':
			{
				'base' : 300,
				'percentage' : 0.1
			}
		};

		s.angular_velocity = 
		{
			'magnitude' : 0,
			'acceleration' : Math.PI * 8,
			'max' : Math.PI * 5 / 3,
			'drag':
			{
				'base' : Math.PI * 2,
				'percentage' : 0.1
			}
		};

		s.keyPressed = function(key)
		{
			for (i in key)
				if (game.input.keyboard.isDown(key[i]))
					return true;
			return false;
		}

		s.update = function()
		{
			elapsed = this.game.time.elapsed * 0.001;
			va = true;
			aa = true;

			/// Input
	        // Acceleration
	        if (this.keyPressed(this.controls.up))
	            this.velocity.magnitude += this.velocity.acceleration * elapsed;
	        else if (this.keyPressed(this.controls.down))
	            this.velocity.magnitude -= this.velocity.acceleration * elapsed;
	        else
	        	va = false;

	        // Rotation
	        if (this.keyPressed(this.controls.left))
	            this.angular_velocity.magnitude -= this.angular_velocity.acceleration * elapsed;
	        else if (this.keyPressed(this.controls.right))
	            this.angular_velocity.magnitude += this.angular_velocity.acceleration * elapsed;
	        else
	        	aa = false;

	        /// Drag
	        if (!va)
	        {
		        sign = direction(this.velocity.magnitude);
		        	this.velocity.magnitude += -sign * (this.velocity.drag.base + this.velocity.drag.percentage * this.velocity.magnitude) * elapsed;
		        if (sign != direction(this.velocity.magnitude) && this.velocity.magnitude != 0)
	            	this.velocity.magnitude = 0;
	        }

	        if (!aa)
	        {
		        sign = direction(this.angular_velocity.magnitude);
		        this.angular_velocity.magnitude += -sign * (this.angular_velocity.drag.base + this.angular_velocity.drag.percentage * this.angular_velocity.magnitude) * elapsed;
		        if (sign != direction(this.angular_velocity.magnitude) && this.angular_velocity.magnitude != 0)
		            this.angular_velocity.magnitude = 0;
		    }

	        /// Limits
	        sign = direction(this.velocity.magnitude);
	        if (Math.abs(this.velocity.magnitude) > this.velocity.max)
	            this.velocity.magnitude = sign * this.velocity.max;

	        sign = direction(this.angular_velocity.magnitude);
	        if (Math.abs(this.angular_velocity.magnitude) > this.angular_velocity.max)
	            this.angular_velocity.magnitude = sign * this.angular_velocity.max;

	        /// Update
	        // Rotation
	        this.rotation += this.angular_velocity.magnitude * elapsed;

	        // Translation
	        this.position.y += Math.sin(this.rotation) * this.velocity.magnitude * elapsed;
	        this.position.x += Math.cos(this.rotation) * this.velocity.magnitude * elapsed;

	        /// Boundaries
	        // Width
	        if (this.position.x > game.width + this.width / 2)
	            this.position.x = -this.width / 2 + 1;
	        else if (this.position.x < -this.width / 2)
	            this.position.x = game.width + this.width / 2 - 1;
	        // Height
	        if (this.position.y > game.height + this.height / 2)
	            this.position.y = -this.height / 2 + 1;
	        else if (this.position.y < -this.height / 2)
	            this.position.y = game.height + this.height / 2 - 1;
		}

		return s
	}