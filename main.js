class LandingPage extends Phaser.Scene {
    constructor() {
        super('LandingPage');
        this.players = [
            { name: 'Tuchi', color: 0x4ecdc4 },
            { name: 'Rwizi', color: 0xff6b6b },
            { name: 'T.B.', color: 0xf7b32b },
            { name: 'A.S.H.', color: 0x1a535c },
            { name: 'Abid', color: 0x8e44ad },
            { name: 'Oma', color: 0x27ae60 }
        ];
        this.selectedIndex = 0;
    }

    preload() {
        this.load.image('TB', 'assets/TB.png');
        this.load.image('Rwizi', 'assets/Rwizi.png');
        this.load.image('Tuchi', 'assets/Tuchi.png');
    }

    create() {
        this.drawRadialBackground();
        this.add.text(400, 60, 'Pick Your Player', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);

        this.playerNameText = this.add.text(400, 140, this.players[this.selectedIndex].name, { fontSize: '40px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

        // Next/Prev buttons
        this.prevBtn = this.add.text(250, 140, '<', { fontSize: '40px', color: '#fff', backgroundColor: '#444', padding: { x: 16, y: 8 } })
            .setInteractive()
            .on('pointerdown', () => this.changePlayer(-1));
        this.nextBtn = this.add.text(550, 140, '>', { fontSize: '40px', color: '#fff', backgroundColor: '#444', padding: { x: 16, y: 8 } })
            .setInteractive()
            .on('pointerdown', () => this.changePlayer(1));

        // Player icons (blobs)
        this.playerIcons = [];
        this.focusedBlob = null;
        this.focusedImage = null;
        this.unfocusedImages = [];
        this.renderPlayerBlobs();

        // Start button
        this.startBtn = this.add.text(400, 500, 'START', { fontSize: '48px', color: '#fff', backgroundColor: '#4ecdc4', padding: { x: 40, y: 20 } })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('PlayerPage', { playerIndex: this.selectedIndex });
            });
    }

    drawRadialBackground() {
        if (this.bgGraphics) this.bgGraphics.destroy();
        const width = this.sys.game.config.width;
        const height = this.sys.game.config.height;
        const centerColor = this.players[this.selectedIndex].color;
        const darkColor = 0x222222;
        const steps = 16;
        const graphics = this.add.graphics();
        for (let i = steps; i > 0; i--) {
            const radius = (Math.max(width, height) / 2) * (i / steps);
            // Interpolate so center is brightest
            const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                Phaser.Display.Color.IntegerToColor(centerColor),
                Phaser.Display.Color.IntegerToColor(darkColor),
                steps,
                i - 1 // i=steps is center (brightest), i=1 is periphery (darkest)
            );
            const fillColor = Phaser.Display.Color.GetColor(color.r, color.g, color.b);
            graphics.fillStyle(fillColor, 1);
            graphics.fillCircle(width / 2, height / 2, radius);
        }
        graphics.setDepth(-1);
        this.bgGraphics = graphics;
    }

    renderPlayerBlobs() {
        // Remove previous blobs if any
        if (this.playerIcons.length > 0) {
            this.playerIcons.forEach(icon => icon.destroy());
            this.playerIcons = [];
        }
        if (this.focusedBlob) {
            this.focusedBlob.destroy();
            this.focusedBlob = null;
        }
        if (this.focusedImage) {
            this.focusedImage.destroy();
            this.focusedImage = null;
        }
        if (this.unfocusedImages) {
            this.unfocusedImages.forEach(img => img.destroy());
        }
        this.unfocusedImages = [];
        // Layout: focused blob/image centered, others smaller and spaced below
        const centerY = 270;
        const focusedRadius = 80;
        const unfocusedRadius = 28;
        const unfocusedYStart = centerY + focusedRadius + 40;
        const unfocusedSpacing = 60;
        // Focused blob/image (selected player)
        if (this.selectedIndex === 2) { // T.B.
            this.focusedImage = this.add.image(400, centerY, 'TB').setDisplaySize(focusedRadius*2, focusedRadius*2);
            this.focusedImage.setDepth(1);
        } else if (this.selectedIndex === 1) { // Rwizi
            this.focusedImage = this.add.image(400, centerY, 'Rwizi').setDisplaySize(focusedRadius*2, focusedRadius*2);
            this.focusedImage.setDepth(1);
        } else if (this.selectedIndex === 0) { // Tuchi
            this.focusedImage = this.add.image(400, centerY, 'Tuchi').setDisplaySize(focusedRadius*2, focusedRadius*2);
            this.focusedImage.setDepth(1);
        } else {
            this.focusedBlob = this.add.circle(400, centerY, focusedRadius, this.players[this.selectedIndex].color).setStrokeStyle(6, 0xffffff);
        }
        // Unfocused blobs/images (other players)
        let unfocusedIdx = 0;
        for (let i = 0; i < this.players.length; i++) {
            if (i === this.selectedIndex) continue;
            const x = 220 + unfocusedIdx * ((800-440)/(this.players.length-2));
            const y = unfocusedYStart;
            if (i === 2) { // T.B.
                const img = this.add.image(x, y, 'TB').setDisplaySize(unfocusedRadius*2, unfocusedRadius*2).setAlpha(0.6);
                this.unfocusedImages.push(img);
            } else if (i === 1) { // Rwizi
                const img = this.add.image(x, y, 'Rwizi').setDisplaySize(unfocusedRadius*2, unfocusedRadius*2).setAlpha(0.6);
                this.unfocusedImages.push(img);
            } else if (i === 0) { // Tuchi
                const img = this.add.image(x, y, 'Tuchi').setDisplaySize(unfocusedRadius*2, unfocusedRadius*2).setAlpha(0.6);
                this.unfocusedImages.push(img);
            } else {
                const icon = this.add.circle(x, y, unfocusedRadius, this.players[i].color).setStrokeStyle(2, 0xffffff).setAlpha(0.6);
                this.playerIcons.push(icon);
            }
            unfocusedIdx++;
        }
    }

    changePlayer(dir) {
        this.selectedIndex = (this.selectedIndex + dir + this.players.length) % this.players.length;
        this.playerNameText.setText(this.players[this.selectedIndex].name);
        this.drawRadialBackground();
        this.renderPlayerBlobs();
        this.updatePlayerIcons();
    }

    updatePlayerIcons() {
        // No-op: handled by renderPlayerBlobs now
    }
}

class PlayerPage extends Phaser.Scene {
    constructor() {
        super('PlayerPage');
        this.sceneIndex = 0;
    }

    preload() {
        this.load.image('TB', 'assets/TB.png');
        this.load.image('Rwizi', 'assets/Rwizi.png');
        this.load.image('Tuchi', 'assets/Tuchi.png');
    }

    init(data) {
        this.playerIndex = data.playerIndex;
        this.players = [
            { name: 'Tuchi', scenes: [
                { title: 'Deep Chill Mix', desc: 'Tuchi is DJing at the club.' },
                { title: 'Tuchi Shop', desc: 'Tuchi is running a shop stall.' }
            ] },
            { name: 'Rwizi', scenes: [
                { title: 'Word of the Day', desc: 'Rwizi gives the word of the day with a microphone.' },
                { title: 'Lupiiya books', desc: 'Rwizi is displaying an app.' }
            ] },
            { name: 'T.B.', scenes: [
                { title: 'Morning Thought', desc: 'T.B. shares a morning story with a newspaper.' },
                { title: 'Evening Reflection', desc: 'T.B. gives an evening reflection.' }
            ] },
            { name: 'A.S.H.', scenes: [
                { title: 'Simmer Down Vibes', desc: 'A.S.H. gives recommendations at a desk.' },
                { title: 'Merch', desc: 'A.S.H. turns the desk into a shop stall.' }
            ] },
            { name: 'Abid', scenes: [
                { title: 'Entrepreneur Resource', desc: 'Abid is offering a resource for an entrepreneur.' },
                { title: 'Party Plug', desc: 'Abid is telling you where the party is at.' }
            ] },
            { name: 'Oma', scenes: [
                { title: 'Story of the Day', desc: 'Oma has a story of the day.' },
                { title: 'Long Stories', desc: 'Oma shares long stories.' }
            ] }
        ];
    }

    create() {
        this.cameras.main.setBackgroundColor('#333');
        this.sceneIndex = 0;
        this.renderScene();
    }

    renderScene() {
        // Destroy previous objects if they exist
        if (this.titleText) this.titleText.destroy();
        if (this.descText) this.descText.destroy();
        if (this.icon) this.icon.destroy();
        if (this.iconImage) this.iconImage.destroy();
        if (this.toggleBtn) this.toggleBtn.destroy();
        if (this.backBtn) this.backBtn.destroy();
        if (this.optionButtons) {
            this.optionButtons.forEach(btn => btn.destroy());
        }
        if (this.longButton) this.longButton.destroy();

        const player = this.players[this.playerIndex];
        const scene = player.scenes[this.sceneIndex];
        const nextSceneTitle = player.scenes[1 - this.sceneIndex].title;

        // Larger grid layout parameters
        const btnW = 110, btnH = 90, pad = 28;
        const gridCols = 2, gridRows = 2;
        const gridWidth = btnW * gridCols + pad * (gridCols - 1);
        const gridHeight = btnH * gridRows + pad * (gridRows - 1);
        const groupWidth = 60 * 2 + 48 + gridWidth; // blob diameter + gap + grid width
        const centerX = 400;
        // Place blob and grid as a group centered horizontally
        const blobX = this.sceneIndex === 0 ? (centerX - groupWidth / 2 + 60) : (centerX + groupWidth / 2 - 60);
        const gridStartX = this.sceneIndex === 0 ? (blobX + 60 + 48) : (blobX - 60 - 48 - gridWidth);
        const gridStartY = 220;
        // Placeholder icon (circle) or image for T.B., Rwizi, and Tuchi
        const colors = [0x4ecdc4, 0xff6b6b, 0xf7b32b, 0x1a535c, 0x8e44ad, 0x27ae60];
        if (this.playerIndex === 2) { // T.B.
            this.iconImage = this.add.image(blobX, 320, 'TB').setDisplaySize(240, 240);
        } else if (this.playerIndex === 1) { // Rwizi
            this.iconImage = this.add.image(blobX, 320, 'Rwizi').setDisplaySize(240, 240);
        } else if (this.playerIndex === 0) { // Tuchi
            this.iconImage = this.add.image(blobX, 320, 'Tuchi').setDisplaySize(240, 240);
        } else {
            this.icon = this.add.circle(blobX, 320, 60, colors[this.playerIndex]).setStrokeStyle(8, 0xffffff);
        }

        // Option buttons (2x2 grid) and long button below
        this.optionButtons = [];
        for (let row = 0; row < gridRows; row++) {
            for (let col = 0; col < gridCols; col++) {
                const btn = this.add.rectangle(
                    gridStartX + col * (btnW + pad) + btnW / 2,
                    gridStartY + row * (btnH + pad) + btnH / 2,
                    btnW, btnH,
                    0xffffff, 0.15
                ).setStrokeStyle(2, 0xffffff)
                 .setInteractive()
                 .on('pointerdown', () => {});
                this.optionButtons.push(btn);
            }
        }
        // Long button below the grid, perfectly aligned
        const longBtnX = gridStartX + gridWidth / 2;
        const longBtnY = gridStartY + gridHeight + pad + btnH / 2;
        this.longButton = this.add.rectangle(
            longBtnX,
            longBtnY,
            gridWidth,
            btnH,
            0xffffff, 0.15
        ).setStrokeStyle(2, 0xffffff)
         .setInteractive()
         .on('pointerdown', () => {});

        // Toggle scene button (top right corner)
        this.toggleBtn = this.add.text(800 - 40, 40, nextSceneTitle, { fontSize: '28px', color: '#fff', backgroundColor: '#ff6b6b', padding: { x: 20, y: 10 } })
            .setOrigin(1, 0)
            .setInteractive()
            .on('pointerdown', () => {
                this.sceneIndex = 1 - this.sceneIndex;
                this.renderScene();
            });

        // Back button (always create fresh)
        this.backBtn = this.add.text(40, 40, '< Back', { fontSize: '24px', color: '#fff', backgroundColor: '#444', padding: { x: 10, y: 6 } })
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('LandingPage');
            });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    scene: [LandingPage, PlayerPage]
};

const game = new Phaser.Game(config); 